import React from 'react';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './AjoutCellier.css';

/** 
 * Component de l'ajout d'un cellier
 * 
*/
export default class AjoutCellier extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			emplacement: '',
			temperature: 10,
			usager_id: 0,
			titreBoutton: ''
		};

		this.validation = this.validation.bind(this);
		this.creerCellier = this.creerCellier.bind(this);
	}

	/** 
	 * Redirection à la page de connexion si l'usager n'est pas connecté
	 * 
	 */
	componentDidMount() {
		if (!this.props.estConnecte) {
			return this.props.history.push('/connexion');
		}
		this.setState({ titreBoutton: 'Nouveau cellier' });
	}

    componentDidUpdate() {
        if (!this.props.estConnecte) {
            return this.props.history.push('/connexion');
        }
    }
	/** 
	 * Fonction de validation des inputs
	 * 
	 */
	validation() {
		let bValidation = false;

		if (this.state.emplacement && this.state.emplacement.trim() !== '' && this.state.temperature) {
			bValidation = true;
		}
		return bValidation;
	}

	/** 
	 * Fonction de la création d'un cellier
	 * 
	 */
	creerCellier() {
		if (this.validation()) {
			let donnes = {
				emplacement: this.state.emplacement,
				usager_id: this.props.id_usager,
                temperature: this.state.temperature
			};

			const postMethod = {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnes)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/celliers/', postMethod)
				.then((reponse) => reponse.json())
				.then((donnees) => {
					if (donnees.data) return this.props.history.push('/celliers/liste');
				});
		} else {
			console.log('Validation incorrecte!!!');
		}
	}

	render() {
		return (
			<Box>
				<Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', margin: '0 1.8rem' }}>
					<Typography color="text.primary">Mon Cellier</Typography>
					<Typography color="text.primary">Nouveau cellier</Typography>
				</Breadcrumbs>

				<Box
					className="nouvelle_cellier_container"
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
						marginTop: '20vh'
					}}
				>
					<span className="nouvelle_cellier_title"> {this.state.titreBoutton} </span>

					<TextField
						autoFocus
						label="Emplacement"
						variant="outlined"
						onBlur={(evt) => this.setState({ emplacement: evt.target.value })}
					/>
					<TextField
						margin="dense"
						id="temperature"
						label="Température"
						type="number"
						variant="outlined"
						inputProps={{ step: '0.5' }}
						onBlur={(e) => this.setState({ temperature: e.target.value })}
					/>

					<Fab
						variant="extended"
						onClick={() => this.creerCellier()}
						sx={{ backgroundColor: '#641b30', color: 'white' }}
					>
						<AddOutlinedIcon sx={{ marginRight: '1rem' }} />
						Nouveau cellier
					</Fab>

				</Box>
			</Box>
		);
	}
}
