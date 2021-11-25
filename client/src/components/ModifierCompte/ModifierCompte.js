import React from 'react';
import './ModifierCompte.css';
// import Bcryptjs from "bcryptjs";
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';

export default class ModifierCompte extends React.Component {
	constructor(props) {
		super(props);

		// Object contenant les informations d'un usager dans un state.
		this.state = {
			usager: [],
			prenom: '',
			nom: '',
			courriel: '',
			// mot_passe: "",
			// mot_passe_verif: "",
			modifier: false,
			validation: false,
			success: '',
			erreurPrenom: false,
			erreurNom: false,
			erreurCourriel: false
		};

		// Binder le contexte 'this' aux fonctions.
		this.validation = this.validation.bind(this);
		this.modifier = this.modifier.bind(this);
        this.saisirNom = this.saisirNom.bind(this);
        this.saisirPrenom = this.saisirPrenom.bind(this);
        this.saisirCourriel = this.saisirCourriel.bind(this);
	}

	componentDidMount() {
		// Vérifie la connexion et redirige au besoin.
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title('Modifier compte');

		this.getUsagers();
	}

	componentDidUpdate() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}
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
     * Validation du formulaire
     */
	validation() {
		let estValide = false;
		this.setState({
			erreurNom: true,
			erreurPrenom: true,
			erreurCourriel: true
		});

		// Validation selon la forme minimale [a-Z]@[a-Z].
		let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let bRegex = expRegex.test(this.state.courriel);

		if (this.state.nom !== '') {
			this.setState({ erreurNom: false });
		}
		if (this.state.prenom !== '') {
			this.setState({ erreurPrenom: false });
		}
		if (this.state.courriel !== '') {
			this.setState({ erreurCourriel: false });
		}

		if (
			this.state.prenom &&
			this.state.prenom.trim() !== '' &&
			this.state.nom &&
			this.state.nom.trim() !== '' &&
			this.state.courriel &&
			this.state.courriel.trim() !== '' &&
			bRegex
		) {
			estValide = true;
		}
		return estValide;
	}

	/**
    * Fetch de tous les usagers.
    */
	getUsagers() {
		const options = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			}
		};

		fetch(
			'https://rmpdwebservices.ca/webservice/php/usagers/' + window.sessionStorage.getItem('id_usager'),
			options
		)
			.then((reponse) => reponse.json())
			.then((donnees) => {
				this.setState({
					prenom: donnees.data[0].prenom,
					nom: donnees.data[0].nom,
					courriel: donnees.data[0].courriel
				});
			});
	}

	/**
     * Modifier les informations de l'usager.
     */
	modifier() {
		if (this.validation()) {
			const donnees = {
				prenom: this.state.prenom,
				nom: this.state.nom,
				courriel: this.state.courriel
			};

			const options = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnees)
			};

			fetch(
				'https://rmpdwebservices.ca/webservice/php/usagers/' + window.sessionStorage.getItem('id_usager'),
				options
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.data === true) {
						this.setState({ success: 'Informations modifiées' });
					}
				});
		}
	}

	render() {
		// Affichage.
		const msgErreurNom = this.state.erreurNom ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);
		const msgErreurPrenom = this.state.erreurPrenom ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);
		const msgErreurCourriel = this.state.erreurCourriel ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);

		return (
			<Box
				className="modification_contenu"
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
					marginTop: '10vh'
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
					<span className="modification_titre">Modifier son compte</span>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem'
						}}
					>
						{this.state.success !== '' ? (
							<span style={{ color: 'green', marginBottom: '1rem' }}>{this.state.success}</span>
						) : (
							''
						)}
						<TextField
							error={this.state.erreurPrenom}
							onChange={(e) => this.saisirPrenom(e)}
							label="Prénom"
							value={this.state.prenom}
							variant="outlined"
						/>
						{msgErreurPrenom}
						<TextField
							error={this.state.erreurNom}
							onChange={(e) => this.saisirNom(e)}
							label="Nom"
							value={this.state.nom}
							variant="outlined"
						/>
						{msgErreurNom}
						<TextField
							error={this.state.erreurCourriel}
							onChange={(e) => this.saisirCourriel(e)}
							label="Courriel"
							value={this.state.courriel}
							variant="outlined"
							type="email"
						/>
						{msgErreurCourriel}
					</Box>
					<Fab
						variant="extended"
						onClick={() => this.modifier()}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '.5rem',
							backgroundColor: '#641b30',
							color: 'white'
						}}
					>
						<AutoFixHighOutlinedIcon />
						Modifier
					</Fab>
				</Box>
			</Box>
		);
	}
}
