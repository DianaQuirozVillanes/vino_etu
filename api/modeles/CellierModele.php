<?php

namespace VinoAPI\Modeles;

use Exception;

/**
 * Traite les requêtes des celliers à la db.
 */
class CellierModele extends Modele
{
    /**
     * Ajoute un nouveau cellier.
     *
     * @param mixed $data Le body de la requête.
	 * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean Passage de la requête.
     */
    public function ajouterNouveauCellier($data)
    {
        //TODO : Valider les données.
		$res = false;
        
        $requeteBte = $this->_db->prepare("INSERT INTO vino__cellier(emplacement,usager_id,temperature) 
            VALUES (?, ?, ?)");

        if ($requeteBte) {
            $requeteBte->bind_param('sid', $data->emplacement, $data->usager_id, $data->temperature);

            if ($requeteBte->execute()) {
                $res = $this->_db->insert_id;
            } else {
                throw new Exception("Erreur de requête sur la base de données", 1);
            }
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

        return $res;
    }

    /**
     * Retourne tous les celliers d'un usager.
     *
     * @param mixed $id L'id de l'usager.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Array Résultats de la requête.
     */
    public function getCelliersParUsagerId($id)
    {
        $rows = array();

        $res = $this->_db->prepare("SELECT vino__cellier.*, SUM(vino__cellier_inventaire.quantite) AS quantite FROM vino__cellier"
        . " LEFT JOIN vino__cellier_inventaire ON vino__cellier.id_cellier = vino__cellier_inventaire.id_cellier"
        . " WHERE vino__cellier.usager_id = ?"
        . " GROUP BY vino__cellier.emplacement"
        . " ORDER BY vino__cellier.id_cellier");

        if ($res) {
            $res->bind_param('i', $id);

			if ($res->execute()) {
				$results = $res->get_result();
                
                if ($results->num_rows) {
					while ($row = $results->fetch_assoc()) {
                        $row['emplacement'] = trim(utf8_encode($row['emplacement']));
                        $rows[] = $row;
                    }
				}
            } else {
				throw new Exception("Erreur de requête sur la base de données", 1);
			}
        } else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}
        
        return $rows;
    }

    /**
     * Retourne le cellier avec ses bouteilles.
     *
     * @param mixed $id L'id du cellier.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Array $rows Résultats de la requête.
     */
    public function getCellierParIdAvecBouteilles($id)
    {
        $rows = array();

        $res = $this->_db->prepare("SELECT vino__bouteille.*, vino__cellier.id_cellier, vino__cellier.emplacement, .vino__cellier_inventaire.quantite FROM vino__cellier"
            . " LEFT JOIN vino__cellier_inventaire ON vino__cellier.id_cellier = vino__cellier_inventaire.id_cellier"
            . " LEFT JOIN vino__bouteille ON vino__cellier_inventaire.bouteille_id = vino__bouteille.id"
            . " WHERE vino__cellier.id_cellier = ?");

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
     * Retourne le cellier.
     *
     * @param mixed $id L'id du cellier.
     * 
     * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Array $rows Résultats de la requête.
     */
    public function getCellierParId($id)
    {
        $rows = array();

        $res = $this->_db->prepare("SELECT * FROM vino__cellier WHERE id_cellier = ?");

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
     * Delete un cellier de la db.
     *
     * @param Integer $id Id du cellier.
     * 
	 * @throws Exception Erreur de requête sur la base de données.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function deleteCellier($id)
    {
		$res = false;
     
        $requete = $this->_db->prepare("DELETE FROM vino__celier WHERE id_cellier = ?");

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
     * Modifie les infos d'un cellier dans la db.
     *
     * @param Object $body Nouvelles infos de cellier.
     * 
     * @return Boolean $res Succès de la requête.
     */
    public function modifierCellier($body)
    {
		$res = false;

        $requete = $this->_db->prepare("UPDATE vino__cellier SET emplacement = ?, temperature = ? WHERE id_cellier = ?");

        if ($requete) {
			$requete->bind_param('sdi', $body->emplacement, $body->temperature, $body->id);

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
}
