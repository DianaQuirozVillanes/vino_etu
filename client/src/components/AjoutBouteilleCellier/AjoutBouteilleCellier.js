import React from 'react';
import BouteilleSAQ from '../BouteilleSAQ/BouteilleSAQ';

import './AjoutBouteilleCellier.css';

import { Box } from '@mui/system';
import { FormHelperText, TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


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
			pays: undefined,
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
			erreurPrix: false
		};

		// Binder le contexte 'this' aux fonctions.
		this.fetchBouteillesSAQ = this.fetchBouteillesSAQ.bind(this);
		this.ajouterBouteilleCellier = this.ajouterBouteilleCellier.bind(this);
		this.choixBouteille = this.choixBouteille.bind(this);
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
	}

	componentDidUpdate() {
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

	// Choisir la bouteille.
	choixBouteille(info) {
		this.setState({
			bouteillesSAQ: [],
			nom: info.nom,
			prix: info.prix_saq,
			pays: info.pays,
			vino__type_id: info.type,
			url_img: info.url_img,
			url_saq: info.url_saq
		});
	}

	/** 
	 * Fonction de validation des inputs
	 * 
	 */
	validation() {
		let estValide = true;
		this.setState({
			erreurCellier: false,
			erreurNom: false,
			erreurType: false,
			erreurPays: false,
			erreurQuantite: false,
			erreurMillesime: false,
			erreurDate: false,
			erreurPrix: false
		});

		if (this.state.id_cellier === '') {
			this.setState({ erreurCellier: true });
			estValide = false;
		}
		if (this.state.nom === '') {
			this.setState({ erreurNom: true });
			estValide = false;
		}
		if (this.state.pays === '') {
			this.setState({ erreurPays: true });
			estValide = false;
		}
		if (this.state.quantite === '') {
			this.setState({ erreurQuantite: true });
			estValide = false;
		}
		if (this.state.millesime === '') {
			this.setState({ erreurMillesime: true });
			estValide = false;
		}
		if (this.state.date_achat === '') {
			this.setState({ erreurDate: true });
			estValide = false;
		}
		if (this.state.prix === '') {
			this.setState({ erreurPrix: true });
			estValide = false;
		}
		return estValide;
	}

	// Ajouter une bouteille au cellier en POST.
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

	render() {
		const bouteilles = this.state.bouteillesSAQ.map((bouteille, index) => {
			return <BouteilleSAQ info={bouteille} choixBouteille={this.choixBouteille} key={index} />;
		});

		// Affichage.
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

						<FormControl error={this.state.erreurCellier} required>
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
								onChange={(e) => this.setState({ id_cellier: e.target.value })}
							>
								{this.state.celliers.map((cellier) => (
									<MenuItem value={cellier.id_cellier}>{cellier.emplacement}</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							error={this.state.erreurNom}
							id="outlined-error"
							label="Nom"
							variant="outlined"
							value={this.state.nom}
							type="text"
							onChange={(e) => this.setState({ nom: e.target.value })}
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

						<FormControl required error={this.state.erreurType}>
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
								onChange={(e) => this.setState({ vino__type_id: e.target.value })}
							>
								<MenuItem value="1">Vin Rouge</MenuItem>
								<MenuItem value="2">Vin Blanc</MenuItem>
							</Select>
						</FormControl>

						<TextField
							error={this.state.erreurPays}
							label="Origine"
							variant="outlined"
							value={this.state.pays}
							type="text"
							name="pays"
							onChange={(e) => this.setState({ pays: e.target.value })}
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
							error={this.state.erreurQuantite}
							label="Quantité"
							variant="outlined"
							type="number"
							value={this.state.quantite}
							name="quantite"
							onChange={(e) => this.setState({ quantite: e.target.value })}
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
							error={this.state.erreurMillesime}
							label="Millesime"
							variant="outlined"
							value={this.state.millesime}
							name="millesime"
							onChange={(e) => this.setState({ millesime: e.target.value })}
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
							error={this.state.erreurDate}
							label="Date d'achat"
							variant="outlined"
							type="date"
							value={this.state.date_achat}
							name="date_achat"
							onChange={(e) => this.setState({ date_achat: e.target.value })}
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
							error={this.state.erreurPrix}
							label="Prix"
							variant="outlined"
							value={this.state.prix}
							name="prix"
							onChange={(e) => this.setState({ prix: e.target.value })}
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
							label="À conserver?"
							variant="outlined"
							value={this.state.garde}
							name="garde_jusqua"
							onChange={(e) => this.setState({ garde: e.target.value })}
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
							onChange={(e) => this.setState({ commentaires: e.target.value })}
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

					<button onClick={this.ajouterBouteilleCellier}>Ajouter une bouteille au cellier</button>
				</Box>
			</Box>
		);
	}
}
