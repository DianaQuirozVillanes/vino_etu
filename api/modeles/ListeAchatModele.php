<?php

namespace VinoAPI\Modeles;

use Exception;

/**
 * Gère les requêtes des listes d'achats.
 */
class ListeAchatModele extends Modele
{
    /**
     * Get la liste d'achat d'un usager.
     *
     * @param Integer $id Id de l'usager.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function getListeAchatParIdUsager($id)
    {
        $rows = array();

        $firstReq = "SELECT COUNT(*) AS 'rows' FROM `vino__liste_achat` WHERE id_usager = $id";

        $firstRes = $this->_db->query($firstReq);

        $next = false;

        if ($firstRes) {
            if ($firstRes->num_rows) {
                $fetchedRows = $firstRes->fetch_assoc();

                if ($fetchedRows['rows'] > 0) $next = true;
            }
        }

        if ($next) {
            $requete = "SELECT a.id, b.bouteille_id, c.nom, b.millesime, b.quantite FROM vino__liste_achat a, vino__liste_achat_vino b, vino__bouteille c"
                . " WHERE a.id_usager = $id AND a.id = b.liste_achat_id AND b.bouteille_id = c.id";

            if (($res = $this->_db->query($requete)) == true) {
                if ($res->num_rows) {
                    while ($row = $res->fetch_assoc()) {
                        $rows[] = $row;
                    }
                }
            } else {
                throw new Exception("Erreur de requête sur la base de donnée", 1);
            }
        }

        if (!$next) return false;

        return $rows;
    }

    /**
     * Crée une liste d'achat.
     *
     * @param Object $body Donnés de la liste d'achat.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function createListeAchat($body)
    {
        $res = false;

        $requete = "INSERT INTO vino__liste_achat (id_usager) VALUES ('$body->id_usager')";

        $firstRes = $this->_db->query($requete);

        $id = $this->_db->insert_id;

        if ($firstRes) {
            foreach ($body->bouteilles as $bte) {

                $requete = "INSERT INTO vino__liste_achat_vino(liste_achat_id, bouteille_id, millesime, quantite) VALUES (" .
                    "'" . $id . "'," .
                    "'" . $bte->bouteille_id . "'," .
                    "'" . $bte->millesime . "'," .
                    "'" . $bte->quantite . "');";

                $secondRes = $this->_db->query($requete);

                if ($secondRes) {
                    $res = $secondRes;
                } else {
                    throw new Exception("Erreur de requête sur la base de donnée", 1);
                }
            }
        } else {
            throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $res;
    }

    /**
     * Modifie les infos d'une liste d'achat.
     *
     * @param Object $body Nouvelles infos de la liste d'achat.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function modifierListeAchat($body)
    {
        $res = false;

        $next = false;

        $bouteilles = "";
        
        foreach ($body->bouteilles as $bte) {

            $bouteilles .= $bte->id . ',';

            $requete = "INSERT INTO vino__liste_achat_vino (liste_achat_id, bouteille_id, millesime, quantite)"
                . " VALUES ($body->listeAchatId, $bte->id, '$bte->millesime', $bte->quantite)"
                . " ON DUPLICATE KEY UPDATE"
                . " quantite = $bte->quantite";

            $res = $this->_db->query($requete);

            if ($res) {
                $next = true;
            } else {
                throw new Exception("Erreur de requête sur la base de donnée", 1);
            }
        }

        if ($next) {
            $formattedBouteilles = mb_substr($bouteilles, 0, -1);

            $deleteReq = "DELETE FROM vino__liste_achat_vino WHERE liste_achat_id = $body->listeAchatId AND"
                . " bouteille_id NOT IN ($formattedBouteilles)";
    
            $res = $this->_db->query($deleteReq);

            if (!$res)
                throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $res;
    }

    /**
     * Supprime une liste d'achat.
     *
     * @param Integer $id Id de la liste d'achat.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function deleteListeAchat($id)
    {
        $res = false;

        $requete = "DELETE FROM vino__liste_achat_vino WHERE liste_achat_id = $id";

        $firstRes = $this->_db->query($requete);

        if ($firstRes) {
            $requete = "DELETE FROM vino__liste_achat WHERE id = $id";

            $secondRes = $this->_db->query($requete);

            if ($secondRes) {
                $res = $secondRes;
            } else {
                throw new Exception("Erreur de requête sur la base de donnée", 1);
            }
        } else {
            throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $res;
    }
}
