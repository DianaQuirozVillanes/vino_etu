import React from 'react';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import './ModifierCellier.css';

export default class ModifierCellier extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			emplacement: '',
			temperature: 10,
			usager_id: 0,
			titreBoutton: '',
			id: undefined,
			erreurEmplacement: false
		};

		this.saisirEmplacement = this.saisirEmplacement.bind(this);
		this.saisirTemperature = this.saisirTemperature.bind(this);
		this.validation = this.validation.bind(this);
		this.chercherCellier = this.chercherCellier.bind(this);
		this.modifierCellier = this.modifierCellier.bind(this);
	}

	componentDidMount() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title('Modifier cellier');

		this.setState({ titreBoutton: 'Modifier cellier' });
		this.chercherCellier();
	}

	componentDidUpdate() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}
	}

	/**
	 * Saisir la valeur du champs Emplacement
	 * 
	 * @param {string} e Valeur du champs Emplacement
	 */
	saisirEmplacement(e) {
		this.setState({ emplacement: e.target.value });
	}

	/**
	 * Saisir la valeur du champs Temperature
	 * 
	 * @param {string} e Valeur du champs Temperature
	 */
	saisirTemperature(e) {
		this.setState({ temperature: e.target.value });
	}

	/**
	 * Méthode pour chercher les information du cellier
	 * 
	 */
	chercherCellier() {
		const getMethod = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			}
		};

		fetch('https://rmpdwebservices.ca/webservice/php/celliers/' + this.props.match.params.id, getMethod)
			.then((reponse) => reponse.json())
			.then((donnees) => {
				if (donnees.data[0] === undefined) return this.props.history.push('/celliers/liste');
				this.setState({
					emplacement: donnees.data[0].emplacement,
					temperature: donnees.data[0].temperature
				});
			});
	}

	/**
	 * Méthode pour la validation des champs
	 * 
	 * @returns {boolean} estValide
	 */
	validation() {
		let estValide = false;

		this.setState({
			erreurEmplacement: true
		});

		if (this.state.emplacement && this.state.emplacement !== '') {
			estValide = true;
			this.setState({ erreurEmplacement: false });
		}
		return estValide;
	}

	/**
	 * Méthode pour la modification d'un cellier
	 * 
	 */
	modifierCellier() {
		if (this.validation()) {
			let donnees = {
				id: this.props.match.params.id,
				emplacement: this.state.emplacement,
				temperature: this.state.temperature
			};

			const putMethod = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnees)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/celliers/', putMethod)
				.then((reponse) => reponse.json())
				.then((donnees) => {
					if (donnees.data) return this.props.history.push('/celliers/liste');
				});
		} else {
			console.log('Validation incorrecte!!!');
		}
	}

	render() {
		const messageErreurEmplacement = this.state.erreurEmplacement ? (
			<span className="message_erreur">* Ce champ est obligatoire.</span>
		) : (
			''
		);
		return (
			<Box
				className="modifier_cellier_container"
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
					marginTop: '16vh'
				}}
			>
				<span className="modifier_cellier_title"> {this.state.titreBoutton} </span>

				<TextField
					autoFocus
					error={this.state.erreurEmplacement}
					label="Emplacement"
					variant="outlined"
					value={this.state.emplacement}
					onChange={(e) => this.saisirEmplacement(e)}
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
				{messageErreurEmplacement}
				<TextField
					variant="outlined"
					label="Température"
					value={this.state.temperature}
					type="number"
					inputProps={{ step: '0.5' }}
					InputProps={{
						endAdornment: <InputAdornment position="end">°C</InputAdornment>
					}}
					onChange={(e) => this.saisirTemperature(e)}
					sx={{
						color: 'white',
						'& label.Mui-focused': {
							color: 'white'
						},
						'& input:valid:focus + fieldset': {
							borderColor: 'white'
						}
					}}
				/>
				<Fab
					variant="extended"
					onClick={() => this.modifierCellier()}
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
					{this.state.titreBoutton}
				</Fab>
			</Box>
		);
	}
}
