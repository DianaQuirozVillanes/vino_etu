import React from 'react';
import BouteilleSAQ from '../BouteilleSAQ/BouteilleSAQ';
import './AjoutBouteilleCellier.css';
import { Box } from '@mui/system';
import { Fab, FormHelperText, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';





import moment from 'moment';

export default class AjoutBouteille extends React.Component {
	constructor(props) {
		super(props);

		// Object contenant les informations nécéssaire.
		this.state = {
			bouteillesSAQ: [],
			celliers: [],
			recherche: '',
			nomBouteilleSAQ: '',
			prixBouteilleSAQ: '',
			nom: '',
			millesime: moment().format('YYYY'),
			quantite: '1',
			format: '',
			pays: 'Canada',
			date_achat: moment().format('YYYY-MM-DD'),
			prix: '',
			garde: '',
			commentaires: '',
			usager_id: '1',
			vino__type_id: '1',
			id_cellier: '',
			url_img: 'https://www.saq.com/media/wysiwyg/placeholder/category/06.png',
			url_saq: '',
			erreurCellier: false,
			erreurNom: false,
			erreurType: false,
			erreurPays: false,
			erreurQuantite: false,
			erreurMillesime: false,
			erreurDate: false,
			erreurPrix: false,
			erreurFormat: false
		};

		// Binder le contexte 'this' aux fonctions.
		this.fetchBouteillesSAQ = this.fetchBouteillesSAQ.bind(this);
		this.ajouterBouteilleCellier = this.ajouterBouteilleCellier.bind(this);
		this.choixBouteille = this.choixBouteille.bind(this);
		this.saisirCellier = this.saisirCellier.bind(this);
		this.saisirNom = this.saisirNom.bind(this);
		this.saisirTypeVin = this.saisirTypeVin.bind(this);
		this.saisirFormat = this.saisirFormat.bind(this);
		this.saisirOrigine = this.saisirOrigine.bind(this);
		this.saisirQuantite = this.saisirQuantite.bind(this);
		this.saisirMillesime = this.saisirMillesime.bind(this);
		this.saisirDateAchat = this.saisirDateAchat.bind(this);
		this.saisirPrix = this.saisirPrix.bind(this);
		this.saisirConserver = this.saisirConserver.bind(this);
		this.saisirCommentaires = this.saisirCommentaires.bind(this);
		this.fetchCelliers = this.fetchCelliers.bind(this);
		this.validation = this.validation.bind(this);
	}

	componentDidMount() {
		// Vérifie la connexion et redirige au besoin.
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		// Titre du document.
        this.props.title("Ajout bouteille");

		// Get les informations du cellier.
		this.fetchCelliers();

		// Titre du document.
		document.title = this.props.title;
	}

	componentDidUpdate() {
	  if (this.state.celliers.length <= 0) {
			return this.props.history.push('/celliers/ajouter');
		}

		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}
	}

	fetchCelliers() {
		fetch('https://rmpdwebservices.ca/webservice/php/celliers/usager/' + window.sessionStorage.getItem('id_usager'), {
			method: 'GET',
			headers: new Headers({
				'Content-Type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			})
		})
			.then((reponse) => reponse.json())
			.then((donnees) => {
				this.setState({ celliers: donnees.data });
			});
	}

	fetchBouteillesSAQ(event) {
		if (event.target.value === '') {
			this.setState({ bouteillesSAQ: [] });
			return;
		}
		fetch('https://rmpdwebservices.ca/webservice/php/saq/' + event.target.value, {
			method: 'GET',
			headers: new Headers({
				'Content-Type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			})
		})
			.then((reponse) => reponse.json())
			.then((donnees) => {
				this.setState({ bouteillesSAQ: donnees.data });
			});
	}

	/**
	 * Choisir la bouteille.
	 * 
	 * @param {array} info La bouteille choisie dans la liste de recherche
	 */
	choixBouteille(info) {
		this.setState({
			bouteillesSAQ: [],
			nom: info.nom,
			prix: info.prix_saq,
			pays: info.pays,
			format: info.format,
			vino__type_id: info.type,
			url_img: info.url_img,
			url_saq: info.url_saq
		});
	}
	/**
	 * Saisir le cellier
	 * 
	 * @param {string} e Valeur du Select Cellier
	 */
	saisirCellier(e) {
		this.setState({ id_cellier: e.target.value });
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
	 * Saisir le type de vin
	 * 
	 * @param {string} e Valeur du Select Type de vin
	 */
	saisirTypeVin(e) {
		this.setState({ vino__type_id: e.target.value });
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
	 * Saisir le pays d'origine de la bouteille
	 * 
	 * @param {string} e Valeur du champs Origine
	 */
	saisirOrigine(e) {
		this.setState({ pays: e.target.value });
	}

	/**
	 * Saisir la quantité de bouteille à ajouter
	 * 
	 * @param {string} e Valeur du champs Quantité
	 */
	saisirQuantite(e) {
		this.setState({ quantite: e.target.value });
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
	 * Saisir la date d'achat de la bouteille
	 * 
	 * @param {string} e Valeur du champs Date d'achat
	 */
	saisirDateAchat(e) {
		this.setState({ date_achat: e.target.value });
	}

	/**
	 * Saisir le prix d'achat de la bouteille
	 * 
	 * @param {string} e Valeur du champs prix
	 */
	saisirPrix(e) {
		this.setState({ prix: e.target.value });
	}

	/**
	 * Saisir la conservation de la bouteille
	 * 
	 * @param {string} e Valeur du champs À conserver
	 */
	saisirConserver(e) {
		this.setState({ garde: e.target.value });
	}

	/**
	 * Saisir les commentaires de l'usager sur la bouteille
	 * 
	 * @param {string} e Valeur du champs Commentaires
	 */
	saisirCommentaires(e) {
		this.setState({ commentaires: e.target.value });
	}

	/** 
	 * Fonction de validation des inputs
	 * 
	 */
	validation() {
		let estValide = false;
		this.setState({
			erreurCellier: true,
			erreurNom: true,
			erreurType: true,
			erreurPays: true,
			erreurQuantite: true,
			erreurMillesime: true,
			erreurDate: true,
			erreurPrix: true,
			erreurFormat: true
		});

		if (this.state.id_cellier !== '') {
			this.setState({ erreurCellier: false });
		}
		if (this.state.nom !== '') {
			this.setState({ erreurNom: false });
		}
		if (this.state.format !== '') {
			this.setState({ erreurFormat: false });
		}
		if (this.state.pays !== '') {
			this.setState({ erreurPays: false });
		}
		if (this.state.quantite !== '') {
			this.setState({ erreurQuantite: false });
		}
		if (this.state.millesime !== '') {
			this.setState({ erreurMillesime: false });
		}
		if (this.state.date_achat !== '') {
			this.setState({ erreurDate: false });
		}
		if (this.state.prix !== '') {
			this.setState({ erreurPrix: false });
		}

		if (
			this.state.id_cellier &&
			this.state.id_cellier !== '' &&
			(this.state.nom && this.state.nom.trim() !== '') &&
			(this.state.format && this.state.format.trim() !== '') &&
			(this.state.quantite && this.state.quantite.trim() !== '') &&
			(this.state.millesime && this.state.millesime.trim() !== '') &&
			(this.state.date_achat && this.state.date_achat.trim() !== '') &&
			(this.state.prix && this.state.prix.trim() !== '')
		) {
			estValide = true;
		}
		return estValide;
	}

	/**
	 * Ajouter une bouteille au cellier en POST.
	 */
	ajouterBouteilleCellier() {
		if (this.validation()) {
			const entete = new Headers();
			const nouvelleBouteille = {
				prixBouteilleSAQ: this.state.prix,
				usager_id: window.sessionStorage.getItem('id_usager'),
				nom: this.state.nom,
				pays: this.state.pays,
				millesime: this.state.millesime,
				url_saq: this.state.url_saq,
				url_img: this.state.url_img,
				vino__type_id: this.state.vino__type_id,
				garde_jusqua: this.state.garde,
				note_degustation: this.state.commentaires,
				date_ajout: this.state.date_achat,
				id_cellier: this.state.id_cellier,
				quantite: this.state.quantite,
				prix: this.state.prix
			};
			entete.append('Content-Type', 'application/json');
			fetch('https://rmpdwebservices.ca/webservice/php/bouteilles', {
				method: 'POST',
				body: JSON.stringify(nouvelleBouteille),
				headers: new Headers({
					'Content-Type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				})
			})
				.then((reponse) => reponse.json())
				.then(() => {
					this.props.history.push('/cellier/' + this.state.id_cellier);
				});
		} else {
			console.log('Validation incorrecte');
		}
	}

	/**
	 * Affichage de la page
	 * 
	 * @returns JSX
	 */
  
	render() {
		// Map des bouteilles dans le cellier
		const bouteilles = this.state.bouteillesSAQ.map((bouteille, index) => {
			return <BouteilleSAQ info={bouteille} choixBouteille={this.choixBouteille} key={index} />;
		});
		// Inclus la liste des pays en JSON
		const listePays = require('../../pays.json');

		// Affichage des messages d'erreurs
		const msgErreurCellier = this.state.erreurCellier ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurNom = this.state.erreurNom ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurFormat = this.state.erreurFormat ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurPays = this.state.erreurPays ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurQuantite = this.state.erreurQuantite ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurMillesime = this.state.erreurMillesime ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurDate = this.state.erreurDate ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);
		const msgErreurPrix = this.state.erreurPrix ? (
			<span className="message_erreur">* Ce champ est obligatoire</span>
		) : (
			''
		);

		return (
			<Box
				className="formulaire_ajout_bouteille_cellier"
				sx={{
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					display: 'flex',
					justfyContent: 'center',
					alignItems: 'center',
					gap: '1rem',
					width: '85vw',
					flexDirection: 'column',
					borderRadius: '1rem',
					margin: '0 auto'
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
					<span className="ajout_bouteille_cellier_titre">Ajouter une bouteille au cellier</span>

					<Box
						component="form"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem'
						}}
					>
						<TextField
							label="Recherche d'une bouteille"
							variant="outlined"
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							onChange={(event) => this.fetchBouteillesSAQ(event)}
							sx={{
								color: 'white',
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
						{bouteilles}

						<FormControl
							sx={{
								'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
									borderColor: 'white'
								}
							}}
						>
							<InputLabel id="cellier-label">Choisir le cellier</InputLabel>

							<Select
								label="Choisir le cellier"
								labelId="cellier-label"
								sx={{
									color: 'white',
									'& .MuiSelect-icon': {
										color: 'white'
									}
								}}
								value={this.state.id_cellier}
								onChange={(e) => this.saisirCellier(e)}
							>
								{this.state.celliers.map((cellier) => (
									<MenuItem value={cellier.id_cellier}>{cellier.emplacement}</MenuItem>
								))}
							</Select>
						</FormControl>
						{msgErreurCellier}
						<TextField
							error={this.state.erreurNom}
							id="outlined-error"
							label="Nom"
							variant="outlined"
							value={this.state.nom}
							type="text"
							onChange={(e) => this.saisirNom(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							className="ajout_bouteille_input"
							sx={{
								color: 'white',
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
						<FormControl
							sx={{
								'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
									borderColor: 'white'
								}
							}}
						>
							<InputLabel id="type-label">Type de vin</InputLabel>
							<Select
								label="Type de vin"
								labelId="type-label"
								sx={{
									color: 'white',
									'& .MuiSelect-icon': {
										color: 'white'
									}
								}}
								value={this.state.vino__type_id}
								onChange={(e) => this.saisirTypeVin(e)}
							>
								<MenuItem value="1">Vin Rouge</MenuItem>
								<MenuItem value="2">Vin Blanc</MenuItem>
								<MenuItem value="3">Vin Rosé</MenuItem>
							</Select>
						</FormControl>

						<TextField
							autoFocus
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
									borderColor: 'red',
									padding: '4px !important'
								},
								'& input:valid:focus + fieldset': {
									borderColor: 'white'
								}
							}}
						/>
						{msgErreurFormat}
						<FormControl
						sx={{
							'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: 'white'
							},
							'& .MuiFormLabel-root.Mui-focused': {
								color: 'white'
							}
						}}>
							<InputLabel id="cellier-label">Origine</InputLabel>
							<Select
								label="Origine"
								labelId="origine-label"
								sx={{
									color: 'white',
									'& label.Mui-focused': {
										color: 'white'
									},
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
							error={this.state.erreurQuantite}
							label="Quantité"
							variant="outlined"
							type="number"
							value={this.state.quantite}
							name="quantite"
							onChange={(e) => this.saisirQuantite(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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
						{msgErreurQuantite}
						<TextField
							error={this.state.erreurMillesime}
							label="Millesime"
							variant="outlined"
							value={this.state.millesime}
							name="millesime"
							onChange={(e) => this.saisirMillesime(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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
						{msgErreurMillesime}
						<TextField
							error={this.state.erreurDate}
							label="Date d'achat"
							variant="outlined"
							type="date"
							value={this.state.date_achat}
							name="date_achat"
							onChange={(e) => this.saisirDateAchat(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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
						<TextField
							error={this.state.erreurPrix}
							label="Prix"
							variant="outlined"
							value={this.state.prix}
							name="prix"
							onChange={(e) => this.saisirPrix(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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
						{msgErreurPrix}
						<TextField
							label="À conserver?"
							variant="outlined"
							value={this.state.garde}
							name="garde_jusqua"
							onChange={(e) => this.saisirConserver(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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

						<TextField
							label="Commentaires"
							variant="outlined"
							value={this.state.commentaires}
							name="notes"
							onChange={(e) => this.saisirCommentaires(e)}
							InputLabelProps={{
								className: 'ajout_bouteille_input'
							}}
							sx={{
								color: 'white',
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
					</Box>

					<Fab
						variant="extended"
						onClick={() => this.ajouterBouteilleCellier()}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '.5rem',
							backgroundColor: '#641b30',
							color: 'white'
						}}
					>
						<AddOutlinedIcon />
						Nouvelle bouteille
					</Fab>
				</Box>
			</Box>
		);
	}
}
