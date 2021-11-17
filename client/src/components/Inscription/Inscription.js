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
			erreurMot_passe: false,
			erreurMot_passe_verif: false
		};

		this.validation = this.validation.bind(this);
		this.sinscrire = this.sinscrire.bind(this);
	}

	componentDidMount() {
		if (this.props.estConnecte) {
			return this.props.history.push('/connexion');
		}
	}

	validation() {
		// Validation selon la forme minimale [a-Z]@[a-Z]
		let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let bRegex = expRegex.test(this.state.courriel);

		let estValide = true;

		this.setState({
			erreurPrenom: false,
			erreurNom: false,
			erreurCourriel: false,
			erreurMot_passe: false,
			erreurMot_passe_verif: false
		});

		if (this.state.prenom === '') {
			this.setState({ erreurPrenom: true });
			estValide = false;
		}
		if (this.state.nom === '') {
			this.setState({ erreurNom: true });
			estValide = false;
		}
		if (this.state.courriel.trim() === '' && !bRegex) {
			this.setState({ erreurCourriel: true });
			estValide = false;
		}
		if (this.state.mot_passe === '') {
			this.setState({ erreurMot_passe: true });
			estValide = false;
		}
		if (this.state.mot_passe_verif === '') {
			this.setState({ erreurMot_passe_verif: true });
			estValide = false;
		}
		if (this.state.mot_passe_verif !== this.state.mot_passe) {
			this.setState({ erreurMot_passe_verif: true });
			estValide = false;
		}
    return estValide;
	}

	sinscrire() {
    console.log(this.validation());
		if (this.validation()) {
			let mot_chiffre = Bcryptjs.hashSync(this.state.mot_passe).toString();

			const donnes = {
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
				body: JSON.stringify(donnes)
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
					marginTop: '15vh'
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
							onBlur={(evt) => this.setState({ nom: evt.target.value })}
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
						<TextField
							error={this.state.erreurPrenom}
							label="Prénom"
							variant="outlined"
							onBlur={(evt) => this.setState({ prenom: evt.target.value })}
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
						<TextField
							error={this.state.erreurCourriel}
							label="Courriel"
							variant="outlined"
							type="email"
							onBlur={(evt) => this.setState({ courriel: evt.target.value })}
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
						<TextField
							error={this.state.erreurMot_passe}
							label="Mot de passe"
							variant="outlined"
							type="password"
							name="mot de passe"
							onBlur={(evt) => this.setState({ mot_passe: evt.target.value })}
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
						<TextField
							error={this.state.erreurMot_passe_verif}
							label="Confirmer mot de passe"
							variant="outlined"
							type="password"
							onBlur={(evt) => this.setState({ mot_passe_verif: evt.target.value })}
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
					</Box>

					<Fab
						variant="extended"
						onClick={() => this.sinscrire()}
						sx={{ backgroundColor: '#641b30', color: 'white' }}
					>
						<ExitToAppOutlinedIcon sx={{ marginRight: '1rem' }} />
						Créer un compte
					</Fab>
				</Box>
			</Box>
		);
	}
}
