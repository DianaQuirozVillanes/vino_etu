import React from "react";
import Entete from "../Entete/Entete";
import Pied from "../Pied/Pied";
import Page404 from "../Page404/Page404";
import AjoutBouteille from "../AjoutBouteilleCellier/AjoutBouteilleCellier";
import ListeBouteilles from "../ListeBouteillesCellier/ListeBouteilleCellier";
import Inscription from "../Inscription/Inscription";
import Connexion from "../Connexion/Connexion";
import ListeCelliers from "../ListeCelliers/ListeCellier";
import AjoutCellier from "../AjoutCellier/AjoutCellier";
import DetailsBouteille from "../DetailsBouteille/DetailsBouteille";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import ModifierCompte from "../ModifierCompte/ModifierCompte";
import ListeAchat from "../ListeAchat/ListeAchat";
import "./App.css";
import Admin from "../Admin/Admin";
import ModifierCellier from "../ModifierCellier/ModifierCellier";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      estConnecte: false,
      id_usager: undefined,
      estAdmin: false
    };

    this.seConnecter = this.seConnecter.bind(this);
    this.logout = this.logout.bind(this);
    this.fetchUsager = this.fetchUsager.bind(this);

  }

  fetchUsager(id) {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Basic ' + btoa('vino:vino')
      }
    };

    fetch('https://rmpdwebservices.ca/webservice/php/usagers/' + id, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.data[0].est_admin === "1") {
          window.sessionStorage.setItem('estAdmin', true);
        }
      });
  }

  seConnecter(id) {
    this.fetchUsager(id);

    window.sessionStorage.setItem('estConnecte', true)
    window.sessionStorage.setItem('id_usager', id)
  }

  logout() {
    window.sessionStorage.clear();

    window.location.reload();
  }

  render() {
    return (
      <Router>
        <Route
          component={(props) =>
            (<Entete {...props} />)}
        />
        <Switch>
          <Route
            exact
            path="/bouteille/ajout"
            component={(props) => (
              <AjoutBouteille
                title="Ajouter bouteille"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/"
            component={(props) => (
              <ListeCelliers
                title="Liste celliers"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/inscription"
            component={(props) => (
              <Inscription
                title="S'inscrire"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/compte/modifier"
            component={(props) => (
              <ModifierCompte
                title="Modifier son compte"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/connexion"
            component={(props) => (
              <Connexion
                title="Se connecter"
                login={this.seConnecter}
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/celliers/liste"
            component={(props) => (
              <ListeCelliers
                title="Liste celliers"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/cellier/:id"
            render={(param_route) => (
              <ListeBouteilles
                title="Liste des bouteilles"
                id={param_route?.match?.params?.id}
                param={param_route}
                {...param_route}
              />
            )}
          />

          <Route
            exact
            path="/cellier/bouteilles/:id"
            render={(param_route) => (
              <DetailsBouteille
                title="Détails bouteille"
                {...param_route}
                bouteille_id={param_route?.match?.params?.bouteille_id}
                param={param_route}
              />
            )}
          />

          <Route
            exact
            path="/admin"
            component={(props) => (
              <Admin
                title="Admin"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/celliers/ajouter"
            component={(props) => (
              <AjoutCellier
                title="Ajouter cellier"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/cellier/modifier/:id"
            component={(props) => (
              <ModifierCellier
                title="Modifier cellier"
                {...props}
              />
            )}
          />

          <Route
            exact
            path="/listeachat"
            component={(props) => (
              <ListeAchat
                title="Liste d'achat"
                {...props}
              />
            )}
          />

          <Route exact path="*" component={Page404} />
        </Switch>

        <Route
          component={(props) => (
            <Pied
              logout={this.logout}
              {...props}
            />
          )}
        />
      </Router>
    );
  }
}
