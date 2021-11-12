<?php

namespace VinoAPI\Modeles;

use Exception;

/**
 * Gère les requêtes d'usagers.
 */
class UsagerModele extends Modele
{
    /**
     * Retourne si l'authorisation HTTP match un usager à la db.
     *
     * @param String Courriel de l'usager.
     * @param String Mot de passe de l'usager.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     *  
     * @return Boolean $match Authentification valide.
     */
    public function match($courriel, $password)
    {
        $match = false;

        $requete = "SELECT id_usager, mot_passe FROM vino__usager WHERE courriel = '$courriel'";

        if (($res = $this->_db->query($requete)) == true) {
            if ($res->num_rows) {
                $rows = $res->fetch_assoc();

                if (password_verify($password, $rows['mot_passe']))
                    $match = $rows['id_usager'];
            } else {
                $match = false;
            }
        } else {
            throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $match;
    }

    /**
     * Retourne si l'authorisation HTTP match un usager à la db.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     *  
     * @return Array $rows Tous les usagers.
     */
    public function getUsagers()
    {
        $rows = array();

        $requete = "SELECT id_usager, nom, prenom, courriel FROM vino__usager";

        if (($res = $this->_db->query($requete)) == true) {
            if ($res->num_rows) {
                while ($row = $res->fetch_assoc()) {
                    $rows[] = $row;
                }
            }
        } else {
            throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $rows;
    }

    /**
     * Retourne toutes les informations d'un usager.
     *
     * @param Integer $id
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Array $rows Infos usager.
     */
    public function getUsagerParId($id)
    {
        $rows = array();

        $requete = "SELECT * FROM vino__usager WHERE id_usager = '$id'";

        if (($res = $this->_db->query($requete)) == true) {
            if ($res->num_rows) {
                while ($row = $res->fetch_assoc()) {
                    $rows[] = $row;
                }
            }
        } else {
            throw new Exception("Erreur de requête sur la base de donnée", 1);
        }

        return $rows;
    }

    /**
     * Modifier les infos d'un usager dans la db.
     *
     * @param Object $body Nouvelles infos.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function modifierUsager($body)
    {
        $requete = "UPDATE vino__usager SET nom = '$body->nom', prenom = '$body->prenom', courriel = '$body->courriel', mot_passe = '$body->mot_passe' WHERE id_usager = $body->id";

        $res = $this->_db->query($requete);

        //TODO Return id de l'usager modifié.
        return $res;
    }

    /**
     * Supprime un usager de la db.
     *
     * @param Integer $id Id de l'usager.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function deleteUsager($id)
    {
        $requete = "DELETE FROM vino__usager WHERE id_usager = $id";

        $res = $this->_db->query($requete);

        return $res;
    }

    /**
     * Ajoute un usager à la db.
     *
     * @param Object $data Body de la requête.
     * 
     * @return mixed $res Id de l'usager ou échec de la requête.
     */
    public function createUsager($data)
    {
        $requete = "INSERT INTO vino__usager(nom,prenom,courriel,mot_passe) VALUES (" .
            "'" . $data->nom . "'," .
            "'" . $data->prenom . "'," .
            "'" . $data->courriel . "'," .
            "'" . $data->mot_passe . "')";

        $res = $this->_db->query($requete);

        if ($res) return $this->_db->insert_id;

        return $res;
    }
}
