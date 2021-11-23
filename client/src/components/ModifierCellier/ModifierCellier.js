import React from 'react';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import Button from '@mui/material/Button';
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

		this.validation = this.validation.bind(this);
		this.chercherCellier = this.chercherCellier.bind(this);
		this.modifierCellier = this.modifierCellier.bind(this);
	}

	componentDidMount() {
        if (!window.sessionStorage.getItem('estConnecte')) {
            return this.props.history.push("/connexion");
        }

		this.props.title("Modifier cellier");

        this.setState({ titreBoutton: "Modifier cellier" })
        this.chercherCellier();
    }

    componentDidUpdate() {
        if (!window.sessionStorage.getItem('estConnecte')) {
            return this.props.history.push('/connexion');
        }
    }

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
				console.log('Données cellier: ', donnees.data[0]);

				this.setState({
					emplacement: donnees.data[0].emplacement,
					temperature: donnees.data[0].temperature
				});
			});
	}

	validation() {
		let estValide = false;

		this.setState({
			erreurEmplacement: true
		});

		if (this.state.emplacement && this.state.emplacement.trim() !== '') {
			estValide = true;
			this.setState({ erreurEmplacement: false });
		}
		return estValide;
	}

	modifierCellier() {
		if (this.validation()) {
			let donnes = {
				id: this.props.match.params.id,
				emplacement: this.state.emplacement,
				temperature: this.state.temperature
			};
			console.log('Donnes: ', donnes);

			const putMethod = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnes)
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
		const messageErreurEmplacement = (
			<span className="message_erreur">{this.state.erreurEmplacement ? '* Ce champ est obligatoire.' : ''}</span>
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
					marginTop: '15vh'
				}}
			>
				<span className="modifier_cellier_title"> {this.state.titreBoutton} </span>

				<TextField
					autoFocus
					error={this.state.erreurEmplacement}
					label="Emplacement"
					variant="outlined"
					value={this.state.emplacement}
					onChange={(evt) => this.setState({ emplacement: evt.target.value })}
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
					onChange={(e) => this.setState({ temperature: e.target.value })}
				/>
				<Fab
					variant="extended"
					onClick={() => this.modifierCellier()}
					sx={{ backgroundColor: '#641b30', color: 'white' }}
				>
					<AutoFixHighOutlinedIcon sx={{ marginRight: '1rem' }} />
					{this.state.titreBoutton}
				</Fab>
			</Box>
		);
	}
}
