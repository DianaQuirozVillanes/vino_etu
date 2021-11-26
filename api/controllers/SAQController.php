<?php

namespace VinoAPI\Controllers;

use VinoAPI\Core\Router;
use VinoAPI\Libs\SAQ;
use VinoAPI\Modeles\BouteilleModele;

/**
 * Gère les méthodes de bouteilles.
 */
class SAQController extends Router
{
    /**
     * Retourne les bouteilles qui matchent la recherche actuelle de l'usager.
     *
     * @return void
     */
    public function autocompleteBouteille()
    {
        if (count($this->urlParams) == 2) {
            $body = array_slice(explode('/', $_SERVER['QUERY_STRING']), 1);

            if (!empty($body)) {
                $bteClassObj = new BouteilleModele;
                $listeBouteille = $bteClassObj->autocomplete($body[0]);

                $this->retour['data'] = $listeBouteille;
            } else {
                $this->retour['erreur'] = $this->erreur(400);
                unset($this->retour['data']);
            }
        } else {
            $this->retour['erreur'] = $this->erreur(400);
            unset($this->retour['data']);
        }

        echo json_encode($this->retour);
    }

    public function importSAQ()
    {
        $page = 90;
        $nombreProduit = 96; //48 ou 96	

        $saq = new SAQ;
        for ($i = 1; $i < $page; $i++)    //permet d'importer séquentiellement plusieurs pages.
        {
            $saq->getProduits($nombreProduit, $i);
        }
    }
}
