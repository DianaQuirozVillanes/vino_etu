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

        $res = $this->_db->prepare("SELECT id_usager, mot_passe FROM vino__usager WHERE courriel = ?");

        if ($res) {
            $res->bind_param('s', $courriel);
            
            if ($res->execute()) {
				$results = $res->get_result();

                if ($results->num_rows) {
                    $rows = $results->fetch_assoc();

                    if (password_verify($password, $rows['mot_passe']))
                        $match = $rows['id_usager'];
                } else {
                    $match = false;
                }
            } else {
				throw new Exception("Erreur de requête sur la base de données", 1);
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

        $res = $this->_db->prepare("SELECT id_usager, nom, prenom, courriel FROM vino__usager");

        if ($res) {
            if ($res->execute()) {
				$results = $res->get_result();

                if ($results->num_rows) {
                    while ($row = $results->fetch_assoc()) {
                        $rows[] = $row;
                    }
                } else {
                    throw new Exception("Erreur de requête sur la base de donnée", 1);
                }
            } else {
				throw new Exception("Erreur de requête sur la base de données", 1);
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

        $res = $this->_db->prepare("SELECT * FROM vino__usager WHERE id_usager = ?");

        if ($res) {
			$res->bind_param('i', $id);

            if ($res->execute()) {
				$results = $res->get_result();

                if ($results->num_rows) {
                    while ($row = $results->fetch_assoc()) {
                        $rows[] = $row;
                    }
                } else {
                    $rows = false;
                }
            } else {
				throw new Exception("Erreur de requête sur la base de données", 1);
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
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function modifierUsager($body)
    {
		$res = false;
     
        $requete = $this->_db->prepare("UPDATE vino__usager SET nom = ?, prenom = ?, courriel = ? WHERE id_usager = ?");

        if ($requete) {
			$requete->bind_param('sssi', $body->nom, $body->prenom, $body->courriel, $body->id);

            if ($requete->execute()) {
				$res = true;
			} else {
				throw new Exception("Erreur de requête sur la base de données", 1);
			}
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

        //TODO Return id de l'usager modifié.
        return $res;
    }

    /**
     * Supprime un usager de la db.
     *
     * @param Integer $id Id de l'usager.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function deleteUsager($id)
    {
		$res = false;
     
        $requete = $this->_db->prepare("DELETE FROM vino__usager WHERE id_usager = ?");

        if ($requete) {
			$requete->bind_param('i', $id);

			if ($requete->execute()) {
				$res = true;
			} else {
				throw new Exception("Erreur de requête sur la base de données", 1);
			}
		} else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

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
        $res = false;
        
        $requeteBte = $this->_db->prepare("INSERT INTO vino__usager(nom,prenom,courriel,mot_passe) 
            VALUES (?, ?, ?, ?)");

            if ($requeteBte) {
                $requeteBte->bind_param('ssss', $data->nom, $data->prenom, $data->courriel, $data->mot_passe);
    
                if ($requeteBte->execute()) {
                    $res = $this->_db->insert_id;
                } else {
                    throw new Exception("Erreur de requête sur la base de données", 1);
                }
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
            }

            if ($res) return $this->_db->insert_id;

        return $res;
    }
}
