import React from "react";
import "./ModifierCompte.css";
// import Bcryptjs from "bcryptjs";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";

export default class ModifierCompte extends React.Component {
    constructor(props) {
        super(props);

        // Object contenant les informations d'un usager dans un state.
        this.state = {
            usager: [],
            prenom: "",
            nom: "",
            courriel: "",
            // mot_passe: "",
            // mot_passe_verif: "",
            modifier: false,
            validation: false,
        };

        // Binder le contexte 'this' aux fonctions.
        this.validation = this.validation.bind(this);
        this.modifier = this.modifier.bind(this);
    }

    componentDidMount() {
        // Vérifie la connexion et redirige au besoin.
        if (!this.props.estConnecte) {
            return this.props.history.push('/connexion');
        }

        // Titre du document.
        document.title = this.props.title;

        // Get les informations de l'usager.
        this.getUsagers()
    }

    /**
     * Validation du formulaire
     */
    validation() {
        let bValidation = false;

        if (
            this.state.prenom &&
            this.state.prenom.trim() !== "" &&
            this.state.nom &&
            this.state.nom.trim() !== "" &&
            this.state.courriel &&
            this.state.courriel.trim() !== ""
            /* this.state.mot_passe &&
               this.state.mot_passe.trim() !== "" &&
               this.state.mot_passe_verif &&
               this.state.mot_passe_verif.trim() !== "" */
        ) {
            // Validation selon la forme minimale [a-Z]@[a-Z].
            let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            let bRegex = expRegex.test(this.state.courriel);

            if (bRegex) {
                /*   if (this.state.mot_passe === this.state.mot_passe_verif) {
                      // chiffrer le mot de passe.
                      let mot_passe_chiffre = Bcryptjs.hashSync(
                          this.state.mot_passe
                      ).toString(); */
                bValidation = true;
            }
        }
        return bValidation;
    }

    /**
    * Fetch de tous les usagers.
    */
    getUsagers() {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Basic ' + btoa('vino:vino')
            }
        }

        fetch("https://rmpdwebservices.ca/webservice/php/usagers/" + this.props.id_usager, options)
            .then(reponse => reponse.json())
            .then((donnees) => {
                this.setState({
                    prenom: donnees.data[0].prenom,
                    nom: donnees.data[0].nom,
                    courriel: donnees.data[0].courriel
                })
            });
    }

    /**
     * Modifier les informations de l'usager.
     */
    modifier() {
        if (this.validation) {

            const donnes = {
                prenom: this.state.prenom,
                nom: this.state.nom,
                courriel: this.state.courriel
            };

            const options = {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    authorization: "Basic " + btoa("vino:vino"),
                },
                body: JSON.stringify(donnes)
            };

            fetch("https://rmpdwebservices.ca/webservice/php/usagers" + this.props.id_usager, options)
                .then(res => res.json())
                .then((data) => {
                    if (data.data === true) {
                        console.log('true');
                    }
                });
        }
    }

    render() {

        // Affichage.
        return (
            <Box
                className="modification_contenu"
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    justfyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    width: "85vw",
                    flexDirection: "column",
                    borderRadius: "1rem",
                    margin: "0 auto",
                    marginTop: "10vh",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "80%",
                        flexDirection: "column",
                        gap: "2rem",
                    }}
                >

                    <span className="modification_titre">Modifier son compte</span>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <TextField
                            onChange={e => this.setState({ prenom: e.target.value })}
                            label="Prénom"
                            value={this.state.prenom}
                            variant="outlined"
                        />
                        <TextField
                            onChange={e => this.setState({ nom: e.target.value })}
                            label="Nom"
                            value={this.state.nom}
                            variant="outlined"
                        />
                        <TextField
                            onChange={e => this.setState({ courriel: e.target.value })}
                            label="Courriel"
                            value={this.state.courriel}
                            variant="outlined"
                            type="email"
                        />
                    </Box>

                    {<button onClick={this.modifier}>{(this.state.modifier, "Modifier le compte")}</button>}

                </Box>

            </Box >
        );
    }
}
