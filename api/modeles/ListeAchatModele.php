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

        $firstRes = $this->_db->prepare("SELECT COUNT(*) AS 'rows' FROM `vino__liste_achat` WHERE id_usager = ?");

        $next = false;

        if ($firstRes) {
            $firstRes->bind_param('i', $id);

            if($firstRes->execute()) {
                $results = $firstRes->get_result();
                
                if ($results->num_rows) {
                    $fetchedRows = $results->fetch_assoc();

                    if ($fetchedRows['rows'] > 0) $next = true;
                }
            }
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

        if ($next) {
            $requete = $this->_db->prepare("SELECT a.id, b.bouteille_id, c.nom, b.millesime, b.quantite FROM vino__liste_achat a, vino__liste_achat_vino b, vino__bouteille c"
                . " WHERE a.id_usager = ? AND a.id = b.liste_achat_id AND b.bouteille_id = c.id");

            if ($requete) {
                $requete->bind_param('i', $id);
        
                if ($requete->execute()) {
                    $results = $requete->get_result();
                
                    if ($results->num_rows) {
                        while ($row = $results->fetch_assoc()) {
                            $rows[] = $row;
                        }
                    }
                } else {
                    throw new Exception("Erreur de requête sur la base de données", 1);
                }
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
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

        $requete = $this->_db->prepare("INSERT INTO vino__liste_achat (id_usager) VALUES (?)");

        if ($requete) {
            $requete->bind_param('i', $body->id_usager);
            
            if ($requete->execute()) {
                $id = $this->_db->insert_id;

                foreach ($body->bouteilles as $bte) {

                    $requete = $this->_db->prepare("INSERT INTO vino__liste_achat_vino(liste_achat_id, bouteille_id, millesime, quantite) 
                        VALUES (?, ?, ?, ?);");
    
                    if ($requete) {
                        $requete->bind_param('iiii', $id, $bte->id, $bte->millesime, $bte->quantite);
            
                        if ($requete->execute()) {
                            $res = true;
                        } else {
                            throw new Exception("Erreur de requête sur la base de données", 1);
                        }
                    } else {
                        throw new Exception("Erreur de requête sur la base de données", 1);
                    }
                }
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
            }
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}
        
        return $res;
    }

    /**
     * Modifie les infos d'une liste d'achat.
     *
     * @param Object $body Nouvelles infos de la liste d'achat.
     * 
     * @throws Exception Erreur de requête sur la base de données.
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
            
            $requete = $this->_db->prepare("INSERT INTO vino__liste_achat_vino (liste_achat_id, bouteille_id, millesime, quantite)"
                . " VALUES (?, ?, ?, ?)"
                . " ON DUPLICATE KEY UPDATE"
                . " quantite = ?");

            if ($requete) {
                $requete->bind_param('iiiii', $body->listeAchatId, $bte->id, $bte->millesime, $bte->quantite, $bte->quantite);
        
                if ($requete->execute()) {
                    $next = true;
                } else {
                    throw new Exception("Erreur de requête sur la base de données", 1);
                }
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
            }
        }

        if ($next) {
            $formattedBouteilles = mb_substr($bouteilles, 0, -1);
            
            $deleteReq = $this->_db->prepare("DELETE FROM vino__liste_achat_vino WHERE liste_achat_id = ? AND"
                . " bouteille_id NOT IN ($formattedBouteilles)");
    
            if ($deleteReq) {
                $deleteReq->bind_param('i', $body->listeAchatId);

                if ($deleteReq->execute()) {
				    $res = true;
                } else { 
				    $res = false;
                    throw new Exception("Erreur de requête sur la base de donnée", 1);
                }
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
            }
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

        $firstRes = $this->_db->prepare("DELETE FROM vino__liste_achat_vino WHERE liste_achat_id = ?");

        if ($firstRes) {
			$firstRes->bind_param('i', $id);

			if ($firstRes->execute()) {
				$secondRes = $this->_db->prepare("DELETE FROM vino__liste_achat WHERE id = ?");

                if ($secondRes) {
                    $secondRes->bind_param('i', $id);
                    
                    if ($secondRes->execute()) {
                        $res = true;
                    } else {
                        throw new Exception("Erreur de requête sur la base de données", 1);
                    }
                } else {
                    throw new Exception("Erreur de requête sur la base de données", 1);
                }
			} else {
				throw new Exception("Erreur de requête sur la base de données", 1);
			}
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}
       
        return $res;
    }
}
