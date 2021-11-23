<?php

namespace VinoAPI\Modeles;

use Exception;

ini_set("display_errors", 1);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
error_reporting(E_ALL);
/**
 * Traite les requêtes des bouteilles à la db.
 */
class BouteilleModele extends Modele
{
	/**
	 * Retourne la bouteille correspondante à l'id.
	 *
	 * @param Integer $id Id de la bouteille.
	 * 
	 * @return Array $rows Bouteille.
	 */
	public function getBouteilleParId($id)
	{
		$rows = array();

		$res = $this->_db->prepare("SELECT vino__bouteille.*, vino__cellier_inventaire.id_cellier, vino__cellier_inventaire.quantite FROM vino__bouteille"
			. " LEFT JOIN vino__type ON vino__type_id = vino__type.id"
			. " INNER join vino__cellier_inventaire ON vino__bouteille.id = vino__cellier_inventaire.bouteille_id"
			. " WHERE vino__bouteille.id = ?");

		if ($res) {
			$res->bind_param('i', $id);
			$res->execute();

			$results = $res->get_result();

			if ($results->num_rows) {
				while ($row = $results->fetch_assoc()) {
					$rows[] = $row;
				}
			}
		} else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

		return $rows;
	}

	/**
	 * Retourne toutes les bouteilles d'un usager.
	 *
	 * @param Integer $id Id de l'usager.
	 * 
	 * @throws Exception Erreur de requête sur la base de données.
	 * 
	 * @return Array $rows Bouteilles de l'usager.
	 */
	public function getBouteillesParUsagerId($id)
	{
		$rows = array();

		$res = $this->_db->prepare("SELECT * FROM vino__cellier_inventaire LEFT JOIN vino__bouteille ON vino__cellier_inventaire.bouteille_id = vino__bouteille.id"
			. " LEFT JOIN vino__type ON vino__bouteille.vino__type_id = vino__type.id"
			. " WHERE usager_id = ?");

		if ($res) {
			$res->bind_param('i', $id);
			$res->execute();

			$results = $res->get_result();

			if ($results->num_rows) {
				while ($row = $results->fetch_assoc()) {
					$rows[] = $row;
				}
			}
		} else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

		return $rows;
	}

	/**
	 * Cette méthode permet de retourner les résultats de recherche pour la fonction d'autocomplete de l'ajout des bouteilles dans le cellier
	 * 
	 * @param String $nom La chaine de caractère à rechercher
	 * @param Integer $nb_resultat Le nombre de résultat maximal à retourner.
	 * 
	 * @throws Exception Erreur de requête sur la base de données.
	 * 
	 * @return Array $rows Id et nom de la bouteille trouvée dans le catalogue
	 */
	public function autocomplete($nom, $nb_resultat = 10)
	{
		$rows = array();

		$success = false;

		$nom = $this->_db->real_escape_string($nom);
		$nom = preg_replace("/\*/", "%", $nom);

		$nomWildcard = '%' . $nom . '%';

		$requeteSAQ = $this->_db->prepare("SELECT *, 'saq' AS 'table' FROM vino__bouteille_saq WHERE (nom) LIKE ? LIMIT 0,10");

		if ($requeteSAQ) {
			$requeteSAQ->bind_param('s', $nomWildcard);
			$requeteSAQ->execute();

			$resultsSAQ = $requeteSAQ->get_result();

			if ($resultsSAQ->num_rows) {
				while ($row = $resultsSAQ->fetch_assoc()) {
					array_push($rows, $row);
				}

				$success = true;
			}

			if ($success) {
				$requeteCellier = $this->_db->prepare("SELECT vino__bouteille.*, vino__cellier_inventaire.quantite, 'cellier' AS 'table' FROM vino__bouteille"
					. " LEFT JOIN vino__cellier_inventaire ON vino__bouteille.id = vino__cellier_inventaire.bouteille_id"
					. " WHERE (nom) LIKE ? LIMIT 0,10");

				if ($requeteCellier) {
					$requeteCellier->bind_param('s', $nomWildcard);
					$requeteCellier->execute();

					$resultsCellier = $requeteCellier->get_result();

					if ($resultsCellier->num_rows) {
						while ($row = $resultsCellier->fetch_assoc()) {
							array_push($rows, $row);
						}
					}
				} else {
					throw new Exception("Erreur de requête sur la base de données", 1);
				}
			}
		} else {
			throw new Exception("Erreur de requête sur la base de données", 1);
		}

		return $rows;
	}

	/**
	 * Cette méthode ajoute une ou des bouteilles au cellier
	 * 
	 * @param Object $data Tableau des données représentants la bouteille.
	 * 
	 * @return Boolean $res Succès ou échec de l'ajout.
	 */
	public function ajouterNouvelleBouteilleCellier($data)
	{
		//TODO : Valider les données.
		$res = false;

		$requeteBte = $this->_db->prepare("INSERT INTO `vino__bouteille` (`usager_id_usager`, `nom`, `pays`, `millesime`, `description`, `url_saq`, `url_img`, `format`, `vino__type_id`, `garde_jusqua`, `note_degustation`, `date_ajout`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");

		$requeteBte->bind_param('ississssisss', $data->usager_id, $data->nom, $data->pays, $data->millesime, $data->description, $data->url_saq, $data->url_img, $data->format, $data->vino__type_id, $data->garde_jusqua, $data->note_degustation, $data->date_ajout);

		if ($requeteBte->execute()) {
			$id = $this->_db->insert_id;

			$requeteInv = $this->_db->prepare("INSERT INTO vino__cellier_inventaire(usager_id, id_cellier, bouteille_id, quantite) VALUES (" .
				"?," .
				"?," .
				"?," .
				"?);");

			if ($requeteInv) {
				$requeteInv->bind_param('iiii', $data->usager_id, $data->id_cellier, $id, $data->quantite);

				if ($requeteInv->execute()) {
					$res = true;
				}
			}
		}

		return $res;
	}

	/**
	 * Cette méthode change la quantité d'une bouteille en particulier dans le cellier
	 * 
	 * @param Integer $id id de la bouteille
	 * @param Integer $nombre Nombre de bouteille a ajouter ou retirer
	 * 
	 * @return Boolean $res Succès ou échec de l'ajout.
	 */
	public function modifierQuantiteBouteilleCellier($id, $nombre)
	{
		//TODO : Valider les données.

		$requete = "UPDATE vino__cellier_inventaire SET quantite = GREATEST(quantite + " . $nombre . ", 0) WHERE bouteille_id = " . $id;

		$res = $this->_db->query($requete);

		return $res;
	}

	/**
	 * Cette méthode UPDATE les informations d'une bouteille.
	 *
	 * @param Object $body Les informations
	 * @return Boolean $res Succès de la requête
	 */
	public function modifierBouteille($body)
	{
		$id = $body->id;

		$requete = "UPDATE vino__bouteille AS t1, vino__cellier_inventaire AS t2"
			. " SET t1.nom = '$body->nom', t1.code_saq = '$body->code_saq', t1.pays = '$body->pays', t1.millesime = $body->millesime, t1.description = '$body->description', t1.format = '$body->format', t1.garde_jusqua = '$body->garde_jusqua', t1.note_degustation = '$body->note', t1.date_ajout = '$body->date_ajout', t2.quantite = '$body->quantite'"
			. " WHERE t1.id = $id AND t2.bouteille_id = $id";

		$res = $this->_db->query($requete);

		//TODO Return id du cellier de la bouteille modifiée.
		return $res;
	}
}
