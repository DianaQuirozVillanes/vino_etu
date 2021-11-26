import React from 'react';
import Page404 from '../Page404/Page404';
import { Route, Redirect, withRouter, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import './Connexion.css';

export default class Connexion extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			courriel: '',
			mot_passe: '',
			id_usager: '',
			messageErreur: '',
			erreurCourriel: false,
			erreurMot_passe: false
		};

		this.validation = this.validation.bind(this);
		this.peseEntree = this.peseEntree.bind(this);
		this.seConnecter = this.seConnecter.bind(this);
	}

	componentDidMount() {
		if (window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title("Connexion");
	}

	validation() {
		let estValide = false;
		this.setState({
			erreurCourriel: true,
			erreurMot_passe: true
		});

		// Validation selon la forme minimale [a-Z]@[a-Z]
		let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let bRegex = expRegex.test(this.state.courriel);

		if (this.state.courriel && this.state.courriel.trim() !== '' && bRegex) {
			this.setState({ erreurCourriel: false });
		}

		if (this.state.mot_passe && this.state.mot_passe.trim() !== '') {
			this.setState({ erreurMot_passe: false });
		}

		if (
			this.state.courriel &&
			this.state.courriel.trim() !== '' &&
			bRegex &&
			(this.state.mot_passe && this.state.mot_passe.trim() !== '')
		) {
			estValide = true;
		}
		return estValide;
	}

	peseEntree(e) {
		if (e.keyCode === 13) {
			this.seConnecter();
		}
	}

	seConnecter() {
		if (this.validation()) {
			const donnees = {
				courriel: this.state.courriel,
				mot_passe: this.state.mot_passe
			};

			const putMethod = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnees)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/usagers/login/', putMethod)
				.then((res) => res.json())
				.then((data) => {
					if (data.data) {
						this.props.login(data.data);
						this.props.history.push('/celliers/liste');
						console.log(this.state.erreurCourriel);
					} else {
						this.setState({ messageErreur: 'Le courriel ou le mot de passe ne correspondent pas.' });
						console.log(this.state.erreurCourriel);
					}
				});
		} else {
		}
	}

	render() {
		const messageErreur = this.state.messageErreur || '';
		const msgErreurCourriel = (
			<span className="message_erreur">
				{this.state.erreurCourriel ? "* L'adresse courriel n'est pas valide." : ''}
			</span>
		);
		const msgErreurMotPasse = (
			<span className="message_erreur">{this.state.erreurMot_passe ? '* Ce champ est obligatoire.' : ''}</span>
		);
		return (
			<Box
				className="contenu_connexion"
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
					<span className="titre_connexion">Bienvenue dans votre cellier</span>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem'
						}}
					>
						<TextField
							autoComplete
							error={this.state.erreurCourriel}
							label="Courriel"
							variant="outlined"
							onBlur={(evt) => this.setState({ courriel: evt.target.value })}
							placeholder="bobus@gmail.com"
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
						{msgErreurCourriel}
						<TextField
							autoComplete
							error={this.state.erreurMot_passe}
							label="Mot de passe"
							type="password"
							variant="outlined"
							onChange={(evt) => this.setState({ mot_passe: evt.target.value })}
							onKeyDown={(e) => this.peseEntree(e)}
							placeholder="12345"
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
						{msgErreurMotPasse}
					</Box>
					<span className="message_erreur">{messageErreur}</span>
					<Fab
						variant="extended"
						onClick={() => this.seConnecter()}
						sx={{ backgroundColor: '#641b30', color: 'white' }}
					>
						<LoginOutlinedIcon sx={{ marginRight: '1rem' }} />
						Se connecter
					</Fab>
				</Box>
			</Box>
		);
	}
}
