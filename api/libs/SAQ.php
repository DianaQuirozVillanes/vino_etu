<?php

namespace VinoAPI\Libs;

use VinoAPI\Modeles\Modele;
use DOMDocument;
use stdClass;

/**
 * WebScraper pour la SAQ.
 */
class SAQ extends Modele
{
	const DUPLICATION = 'duplication';
	const ERREURDB = 'erreurdb';
	const INSERE = 'Nouvelle bouteille insérée';

	private static $_webpage;
	private static $_status;
	private $stmt;

	public function __construct()
	{
		parent::__construct();
		if (!($this->stmt = $this->_db->prepare("INSERT INTO vino__bouteille_saq(nom, type, code_saq, pays, description, prix_saq, url_saq, url_img, format) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"))) {
		}
	}

	public function getProduits($nombre = 24, $page = 1)
	{
		$s = curl_init();
		$url = "https://www.saq.com/fr/produits/vin?p=" . $page . "&product_list_limit=" . $nombre . "&product_list_order=name_asc";

		curl_setopt_array($s, array(
			CURLOPT_URL => $url,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
			CURLOPT_ENCODING => 'gzip, deflate',
			CURLOPT_HTTPHEADER => array(
				'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Language: en-US,en;q=0.5',
				'Accept-Encoding: gzip, deflate',
				'Connection: keep-alive',
				'Upgrade-Insecure-Requests: 1',
			),
		));

		self::$_webpage = curl_exec($s);
		self::$_status = curl_getinfo($s, CURLINFO_HTTP_CODE);
		curl_close($s);

		$doc = new DOMDocument;
		$doc->recover = true;
		$doc->strictErrorChecking = false;
		@$doc->loadHTML(self::$_webpage);
		$elements = $doc->getElementsByTagName("li");
		$i = 0;
		foreach ($elements as $key => $noeud) {
			if (strpos($noeud->getAttribute('class'), "product-item") !== false) {
				$info = $this->recupereInfo($noeud);
				$retour = $this->ajouteProduit($info);

				if ($retour->succes) {
					$i++;
				}
			}
		}

		return $i;
	}

	private function get_inner_html($node)
	{
		$innerHTML = '';
		$children = $node->childNodes;
		foreach ($children as $child) {
			$innerHTML .= $child->ownerDocument->saveXML($child);
		}

		return $innerHTML;
	}

	private function nettoyerEspace($chaine)
	{
		return preg_replace('/\s+/', ' ', $chaine);
	}

	private function recupereInfo($noeud)
	{
		$info = new stdClass;
		$imgFirst = $noeud->getElementsByTagName("img")->item(0);
		if (strpos($imgFirst->getAttribute('class'), "product-image-photo") !== false) {
			$info->img = $imgFirst->getAttribute('src');
		} else {
			$info->img = $noeud->getElementsByTagName("img")->item(1)->getAttribute('src');
		};
		$a_titre = $noeud->getElementsByTagName("a")->item(0);
		$info->url = $a_titre->getAttribute('href');

		$nom = $noeud->getElementsByTagName("a")->item(1)->textContent;
		$info->nom = $this->nettoyerEspace(trim($nom));

		// Type, format et pays
		$aElements = $noeud->getElementsByTagName("strong");
		foreach ($aElements as $node) {
			if ($node->getAttribute('class') == 'product product-item-identity-format') {
				$info->desc = new stdClass;
				$info->desc->texte = $node->textContent;
				$info->desc->texte = $this->nettoyerEspace($info->desc->texte);
				$aDesc = explode("|", $info->desc->texte); // Type, Format, Pays
				if (count($aDesc) == 3) {

					$info->desc->type = trim($aDesc[0]);
					$info->desc->format = trim($aDesc[1]);
					$info->desc->pays = trim($aDesc[2]);
				}

				$info->desc->texte = trim($info->desc->texte);
			}
		}

		//Code SAQ
		$aElements = $noeud->getElementsByTagName("div");
		foreach ($aElements as $node) {
			if ($node->getAttribute('class') == 'saq-code') {
				if (preg_match("/\d+/", $node->textContent, $aRes)) {
					$info->desc->code_SAQ = trim($aRes[0]);
				}
			}
		}

		$aElements = $noeud->getElementsByTagName("span");
		foreach ($aElements as $node) {
			if ($node->getAttribute('class') == 'price') {
				$info->prix = mb_substr($node->textContent, 0, -2);
			}
		}

		return $info;
	}

	private function ajouteProduit($bte)
	{
		$retour = new stdClass;
		$retour->succes = false;
		$retour->raison = '';

		$strip = array(
			'Š' => 'S', 'š' => 's', 'Ž' => 'Z', 'ž' => 'z', 'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'A', 'Ç' => 'C', 'È' => 'E', 'É' => 'E',
			'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O', 'Ù' => 'U',
			'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ý' => 'Y', 'Þ' => 'B', 'ß' => 'Ss', 'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c',
			'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
			'ö' => 'o', 'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b', 'ÿ' => 'y'
		);
		$type = strtr($bte->desc->type, $strip);

		// Récupère le type
		$rows = $this->_db->query("select id from vino__type where type = '" . $type . "'");

		if ($rows->num_rows == 1) {
			$type = $rows->fetch_assoc();
			$type = $type['id'];

			$rows = $this->_db->query("select id from vino__bouteille_saq where code_saq = '" . $bte->desc->code_SAQ . "'");
			if ($rows->num_rows < 1) {
				$this->stmt->bind_param("sisssssss", $bte->nom, $type, $bte->desc->code_SAQ, $bte->desc->pays, $bte->desc->texte, $bte->prix, $bte->url, $bte->img, $bte->desc->format);
				$retour->succes = $this->stmt->execute();
				$retour->raison = self::INSERE;
			} else {
				$retour->succes = false;
				$retour->raison = self::DUPLICATION;
			}
		} else {
			$retour->succes = false;
			$retour->raison = self::ERREURDB;
		}

		return $retour;
	}
}
