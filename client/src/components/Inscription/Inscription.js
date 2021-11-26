import React from 'react';
import './Inscription.css';
import Bcryptjs from 'bcryptjs';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

/* import Page404 from "../Page404/Page404";
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'; */

export default class Inscription extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			prenom: '',
			nom: '',
			courriel: '',
			mot_passe: '',
			mot_passe_verif: '',
			est_admin: false,
			sinscrire: false,
			validation: false,
			mot_passe_chiffre: '',
			erreurPrenom: false,
			erreurNom: false,
			erreurCourriel: false,
			erreurCourrielVide: false,
			erreurMot_passe: false,
			erreurMot_passe_verif: false,
			erreurMot_passe_verif_vide: false
		};

		this.validation = this.validation.bind(this);
		this.sinscrire = this.sinscrire.bind(this);
		this.saisirNom = this.saisirNom.bind(this);
		this.saisirPrenom = this.saisirPrenom.bind(this);
		this.saisirCourriel = this.saisirCourriel.bind(this);
		this.saisirMotPasse = this.saisirMotPasse.bind(this);
		this.saisirMotPasseVerif = this.saisirMotPasseVerif.bind(this);
	}

	componentDidMount() {
		if (window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title("S'enregistrer");
	}

	/**
	 * Saisir la valeur du champs Nom
	 * 
	 * @param {string} e Valeur du champs Nom
	 */
	saisirNom(e) {
		this.setState({ nom: e.target.value });
	}

	/**
	 * Saisir la valeur du champs Prénom
	 * 
	 * @param {string} e Valeur du champs Prénom
	 */
	saisirPrenom(e) {
		this.setState({ prenom: e.target.value });
	}

	/**
	 * Saisir la valeur du champs Courriel
	 * 
	 * @param {string} e Valeur du champs Courriel
	 */
	saisirCourriel(e) {
		this.setState({ courriel: e.target.value });
	}

	/**
	 * Saisir la valeur du champs Mot de passe
	 * 
	 * @param {string} e Valeur du champs Mot de passe
	 */
	saisirMotPasse(e) {
		this.setState({ mot_passe: e.target.value });
	}

	/**
	 * Saisir la valeur du champs Confirmer le mot de passe
	 * 
	 * @param {string} e Valeur du champs Confirmer le mot de passe
	 */
	saisirMotPasseVerif(e) {
		this.setState({ mot_passe_verif: e.target.value });
	}

	/**
	 * Méthode pour la validation des champs
	 * 
	 * @returns {boolean} estValide
	 */
	validation() {
		// Validation selon la forme minimale [a-Z]@[a-Z]
		let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let bRegex = expRegex.test(this.state.courriel);

		let estValide = false;

		this.setState({
			erreurNom: false,
			erreurPrenom: false,
			erreurCourriel: false,
			erreurCourrielVide: false,
			erreurMot_passe: false,
			erreurMot_passe_verif: false,
			erreurMot_passe_verif_vide: false
		});

		if (this.state.prenom === '') {
			this.setState({ erreurPrenom: true });
		}
		if (this.state.nom === '') {
			this.setState({ erreurNom: true });
		}
		if (this.state.courriel === '') {
			this.setState({ erreurCourrielVide: true });
		}
		if (this.state.courriel !== '' && !bRegex) {
			this.setState({ erreurCourriel: true });
		}
		if (this.state.mot_passe === '') {
			this.setState({ erreurMot_passe: true });
		}
		if (this.state.mot_passe_verif === '') {
			this.setState({ erreurMot_passe_verif_vide: true });
		}
		if (this.state.mot_passe_verif !== this.state.mot_passe) {
			this.setState({ erreurMot_passe_verif: true });
		}

		if (
			this.state.nom &&
			this.state.nom.trim() !== '' &&
			(this.state.prenom && this.state.prenom.trim() !== '') &&
			(this.state.courriel && this.state.courriel.trim() !== '' && bRegex) &&
			(this.state.mot_passe && this.state.mot_passe.trim() !== '')
		) {
			estValide = true;
		}

		return estValide;
	}

	/**
	 * Méthode pour l'inscription d'un nouvel usager
	 * 
	 */
	sinscrire() {
		if (this.validation()) {
			let mot_chiffre = Bcryptjs.hashSync(this.state.mot_passe).toString();

			const donnees = {
				nom: this.state.nom,
				prenom: this.state.prenom,
				courriel: this.state.courriel,
				mot_passe: mot_chiffre
			};
			const postMethod = {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnees)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/usagers/', postMethod)
				.then((res) => res.json())
				.then((data) => {
					if (data.data) {
						this.props.history.push('/connexion'); //doit aller sur listecelliers et dèjà connecté
					}
				});
		} else {
		}
	}

	render() {
		const msgErreurPrenom = this.state.erreurPrenom ? (
			<span className="message_erreur">* Ce champ est obligatoire. </span>
		) : (
			''
		);

		const msgErreurNom = this.state.erreurNom ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);

		const msgErreurCourriel = this.state.erreurCourriel ? (
			<span className="message_erreur">* L'adresse courriel n'est pas valide.</span>
		) : '' || this.state.erreurCourrielVide ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);

		const msgErreurMotPasse = this.state.erreurMot_passe ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);

		const msgErreurMotPasseVerif = this.state.erreurMot_passe_verif ? (
			<span className="message_erreur">* Les mots de passe ne sont pas identiques.</span>
		) : '' || this.state.erreurMot_passe_verif_vide ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);

		return (
			<Box
				className="register_container"
				sx={{
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					display: 'flex',
					justfyContent: 'center',
					alignItems: 'center',
					gap: '1rem',
					width: '85vw',
					flexDirection: 'column',
					borderRadius: '1rem',
					margin: '0 auto',
					marginTop: '3vh'
				}}
			>
				<Box
					sx={{
						display: 'flex',
						width: '80%',
						flexDirection: 'column',
						gap: '2rem'
					}}
				>
					<span className="register_title">Créer un compte</span>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem'
						}}
					>
						<TextField
							error={this.state.erreurNom}
							label="Nom"
							variant="outlined"
							onBlur={(e) => this.saisirNom(e)}
							sx={{
								color: 'white',
								'& label.Mui-focused': {
									color: 'white'
								},
								'& input:valid + fieldset': {
									borderColor: 'white'
								},
								'& input:invalid + fieldset': {
									borderColor: 'red',
									color: 'red'
								},
								'& input:invalid:focus + fieldset': {
									borderColor: 'white',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurNom}
						<TextField
							error={this.state.erreurPrenom}
							label="Prénom"
							variant="outlined"
							onBlur={(e) => this.saisirPrenom(e)}
							sx={{
								color: 'white',
								'& label.Mui-focused': {
									color: 'white'
								},
								'& input:valid + fieldset': {
									borderColor: 'white'
								},
								'& input:invalid + fieldset': {
									borderColor: 'red'
								},
								'& input:invalid:focus + fieldset': {
									borderColor: 'white',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurPrenom}
						<TextField
							error={this.state.erreurCourriel || this.state.erreurCourrielVide}
							label="Courriel"
							variant="outlined"
							type="email"
							onBlur={(e) => this.saisirCourriel(e)}
							sx={{
								color: 'white',
								'& label.Mui-focused': {
									color: 'white'
								},
								'& input:valid + fieldset': {
									borderColor: 'white'
								},
								'& input:invalid + fieldset': {
									borderColor: 'red'
								},
								'& input:invalid:focus + fieldset': {
									borderColor: 'white',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurCourriel}
						<TextField
							error={this.state.erreurMot_passe}
							label="Mot de passe"
							variant="outlined"
							type="password"
							name="mot de passe"
							onBlur={(e) => this.saisirMotPasse(e)}
							sx={{
								color: 'white',
								'& label.Mui-focused': {
									color: 'white'
								},
								'& input:valid + fieldset': {
									borderColor: 'white'
								},
								'& input:invalid + fieldset': {
									borderColor: 'red'
								},
								'& input:invalid:focus + fieldset': {
									borderColor: 'white',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurMotPasse}
						<TextField
							error={this.state.erreurMot_passe_verif || this.state.erreurMot_passe_verif_vide}
							label="Confirmer mot de passe"
							variant="outlined"
							type="password"
							onBlur={(e) => this.saisirMotPasseVerif(e)}
							sx={{
								color: 'white',
								'& label.Mui-focused': {
									color: 'white'
								},
								'& input:valid + fieldset': {
									borderColor: 'white'
								},
								'& input:invalid + fieldset': {
									borderColor: 'red'
								},
								'& input:invalid:focus + fieldset': {
									borderColor: 'white',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurMotPasseVerif}
					</Box>

					<Fab
						variant="extended"
						onClick={() => this.sinscrire()}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '.5rem',
							backgroundColor: '#641b30',
							color: 'white'
						  }}
					>
						<ExitToAppOutlinedIcon />
						Créer un compte
					</Fab>
				</Box>
			</Box>
		);
	}
}
