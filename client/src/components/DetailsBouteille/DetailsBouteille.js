import React from 'react';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './DetailsBouteille.css';

export default class DetailsBouteille extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			nom: "",
			description: "",
			pays: "",
			millesime: "",
			code_saq: "",
			format: "",
			garde_jusqua: "",
			note: "",
			date_ajout: "",
			quantite: "",
			id_cellier: "",
			erreurNom: false,
			erreurPays: false,
			erreurMillesime: false,
			erreurFormat: false,
			erreurDate: false
		};

		this.recupereBouteille = this.recupereBouteille.bind(this);
		this.saisirNom = this.saisirNom.bind(this);
		this.saisirDescription = this.saisirDescription.bind(this);
		this.saisirOrigine = this.saisirOrigine.bind(this);
		this.saisirMillesime = this.saisirMillesime.bind(this);
		this.saisirFormat = this.saisirFormat.bind(this);
		this.saisirConserver = this.saisirConserver.bind(this);
		this.saisirCommentaires = this.saisirCommentaires.bind(this);
		this.saisirDateAchat = this.saisirDateAchat.bind(this);
		this.modifier = this.modifier.bind(this);
		this.validation = this.validation.bind(this);
	}

	componentDidMount() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title("Détails bouteille");

		this.recupereBouteille();
	}

	componentDidUpdate() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}
	}

	/**
	 * Saisir le nom de la bouteille
	 * 
	 * @param {string} e Valeur du champs Nom
	 */
	saisirNom(e) {
		this.setState({ nom: e.target.value });
	}

	/**
	 * Saisir la description de la bouteille
	 * 
	 * @param {string} e Valeur du champs Description
	 */
	saisirDescription(e) {
		this.setState({ description: e.target.value });
	}

	/**
	 * Saisir le pays d'origine de la bouteille
	 * 
	 * @param {string} e Valeur du champs Origine
	 */
	saisirOrigine(e) {
		this.setState({ pays: e.target.value });
	}

	/**
	 * Saisir le millesime de la bouteille
	 * 
	 * @param {string} e Valeur du champs Millesime
	 */
	saisirMillesime(e) {
		this.setState({ millesime: e.target.value });
	}

	/**
	 * Saisir le format de la bouteille
	 * 
	 * @param {string} e Valeur du champs Format
	 */
	saisirFormat(e) {
		this.setState({ format: e.target.value });
	}

	/**
	 * Saisir la conservation de la bouteille
	 * 
	 * @param {string} e Valeur du champs À Conserver
	 */
	saisirConserver(e) {
		this.setState({ garde_jusqua: e.target.value });
	}

	/**
	 * Saisir les commentaires de l'usager sur la bouteille
	 * 
	 * @param {string} e Valeur du champs Commentaires
	 */
	saisirCommentaires(e) {
		this.setState({ note: e.target.value });
	}

	/**
	 * Saisir la date d'achat de la bouteille
	 * 
	 * @param {string} e Valeur du champs Date d'achat
	 */
	saisirDateAchat(e) {
		this.setState({ date_ajout: e.target.value });
	}

	/**
	 * Fonction de validation des inputs
	 * 
	 * @returns {boolean} estValide
	 */
	validation() {
		let estValide = false;
		this.setState({
			erreurNom: true,
			erreurPays: true,
			erreurMillesime: true,
			erreurFormat: true,
			erreurDate: true
		});

		if (this.state.nom !== '') {
			this.setState({ erreurNom: false });
		}
		if (this.state.pays !== '') {
			this.setState({ erreurPays: false });
		}
		if (this.state.millesime !== '') {
			this.setState({ erreurMillesime: false });
		}
		if (this.state.format !== '') {
			this.setState({ erreurformat: false });
		}
		if (this.state.date_achat !== '') {
			this.setState({ erreurDate: false });
		}
		if (
			this.state.nom &&
			this.state.nom !== '' &&
			(this.state.pays && this.state.pays !== '') &&
			(this.state.millesime && this.state.millesime !== '') &&
			(this.state.format && this.state.format !== '') &&
			(this.state.date_ajout && this.state.date_ajout !== '')
		) {
			estValide = true;
		}
		return estValide;
	}
	/**
	 * Fetch de la bouteille à modifier
	 */
	recupereBouteille() {
		const getMethod = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			}
		};
		fetch('https://rmpdwebservices.ca/webservice/php/bouteilles/' + this.props.param.match.params.id, getMethod)
			.then((reponse) => reponse.json())
			.then((donnees) => {
				if (donnees.data[0] === undefined) return this.props.history.push('/celliers/liste');

				this.setState({
					nom: donnees.data[0].nom,
					description: donnees.data[0].description,
					pays: donnees.data[0].pays,
					millesime: donnees.data[0].millesime,
					code_saq: donnees.data[0].code_saq,
					format: donnees.data[0].format,
					garde_jusqua: donnees.data[0].garde_jusqua,
					note: donnees.data[0].note_degustation,
					date_ajout: donnees.data[0].date_ajout,
					quantite: donnees.data[0].quantite,
					id_cellier: donnees.data[0].id_cellier
				});
			});
	}
	/**
	 * Fetch du PUT pour modifier la bouteille
	 */
	modifier() {
		if (this.validation()) {
			let donnees = {
				id: this.props.param.match.params.id,
				nom: this.state.nom,
				description: this.state.description,
				pays: this.state.pays,
				millesime: this.state.millesime,
				format: this.state.format,
				garde_jusqua: this.state.garde_jusqua,
				note: this.state.note,
				date_ajout: this.state.date_ajout,
				quantite: this.state.quantite
			};
			const putMethod = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnees)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/bouteilles/', putMethod)
				.then((reponse) => reponse.json())
				.then((donnees) => {
					if (donnees.data) return this.props.history.push('/cellier/' + this.state.id_cellier);
				});
		} else {
			console.log('validation incorrecte');
		}
	}
	/**
	 * Affichage de la page
	 * 
	 * @returns JSX
	 */
	render() {
		// Inclus la liste des pays en JSON
		const listePays = require('../../pays.json');

		// Affichage des messages d'erreurs selon la validation
		const msgErreurNom = this.state.erreurNom ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurPays = this.state.erreurPays ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurMillesime = this.state.erreurMillesime ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurFormat = this.state.erreurFormat ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurDate = this.state.erreurDate ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		return (
			<Box
				className="modif_bouteille_container"
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
					marginTop: '20Avh'
				}}
			>
				<span className="modif_bouteille_title">Modifier une bouteille</span>

				<TextField
					label="Nom"
					type="text"
					error={this.state.erreurNom}
					variant="outlined"
					onChange={(e) => this.saisirNom(e)}
					value={this.state.nom}
					InputLabelProps={{
						className: 'ajout_bouteille_input'
					}}
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
				{msgErreurNom}
				<TextField
					label="Description"
					variant="outlined"
					onChange={(e) => this.saisirDescription(e)}
					value={this.state.description}
					sx={{
						'& input:valid:focus + fieldset': {
							borderColor: 'white'
						},
						'& label.Mui-focused': {
							color: 'white'
						}
					}}
				/>

				<FormControl
					sx={{
						'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: 'white',
						},
						'& .MuiFormLabel-root.Mui-focused': {
							color: 'white'
						}
					}}
				>
					<InputLabel id="cellier-label">Origine</InputLabel>
					<Select
						label="Origine"
						labelId="origine-label"
						sx={{
							color: 'white',
							'& .MuiSelect-icon': {
								color: 'white'
							}
						}}
						value={this.state.pays}
						onChange={(e) => this.saisirOrigine(e)}
					>
						{listePays.map((item) => <MenuItem value={item.name}>{item.name}</MenuItem>)}
					</Select>
				</FormControl>
				{msgErreurPays}
				<TextField
					autoFocus
					error={this.state.erreurMillesime}
					label="Millesime"
					variant="outlined"
					onChange={(e) => this.saisirMillesime(e)}
					value={this.state.millesime}
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
							borderColor: 'red',
							padding: '4px !important'
						},
						'& input:valid:focus + fieldset': {
							borderColor: 'white'
						}
					}}
				/>
				{msgErreurMillesime}
				<TextField
					error={this.state.erreurFormat}
					label="Format"
					variant="outlined"
					onChange={(e) => this.saisirFormat(e)}
					value={this.state.format}
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
				{msgErreurFormat}
				<TextField
					label="Garde jusqu'à"
					variant="outlined"
					onChange={(e) => this.saisirConserver(e)}
					value={this.state.garde_jusqua}
					sx={{
						'& input:valid:focus + fieldset': {
							borderColor: 'white'
						},
						'& label.Mui-focused': {
							color: 'white'
						}
					}}
				/>

				<TextField
					label="Commentaire de dégustation"
					variant="outlined"
					onChange={(e) => this.saisirCommentaires(e)}
					value={this.state.note}
					sx={{
						'& input:valid:focus + fieldset': {
							borderColor: 'white'
						},
						'& label.Mui-focused': {
							color: 'white'
						}
					}}
				/>

				<TextField
					error={this.state.erreurDate}
					label="Date d'ajout"
					variant="outlined"
					onChange={(e) => this.saisirDateAchat(e)}
					value={this.state.date_ajout}
					type="date"
					InputLabelProps={{ shrink: true }}
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
				{msgErreurDate}
				<Fab
					variant="extended"
					onClick={() => this.modifier()}
					sx={{ backgroundColor: '#641b30', color: 'white' }}
				>
					<AutoFixHighOutlinedIcon sx={{ marginRight: '1rem' }} />
					Modifier
				</Fab>
			</Box>
		);
	}
}
