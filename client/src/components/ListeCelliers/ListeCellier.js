import React from 'react';
import Cellier from '../Cellier/Cellier';
import './ListeCellier.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box } from '@mui/system';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Fab from '@mui/material/Fab';

export default class ListeCellier extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			celliers: [],
			id_usager: 0,
			items: []
		};

		this.fetchCelliers = this.fetchCelliers.bind(this);
	}

	componentDidMount() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}

		this.props.title('Liste des celliers');

		this.fetchCelliers();
	}

	componentDidUpdate() {
		if (!window.sessionStorage.getItem('estConnecte')) {
			return this.props.history.push('/connexion');
		}
	}

	fetchCelliers() {
		/*const donnees = {
			usager_id: null
		};*/

		const getMethod = {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				authorization: 'Basic ' + btoa('vino:vino')
			}
		};

		fetch(
			'https://rmpdwebservices.ca/webservice/php/celliers/usager/' + window.sessionStorage.getItem('id_usager'),
			getMethod
		)
			.then((reponse) => reponse.json())
			.then((donnees) => {
				this.setState({ items: donnees.data });
			});
	}

	render() {
		const celliers = this.state.items.map((item, index) => {
			return <Cellier info={item} key={index} {...this.props} />;
		});

		return (
			<Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: '1rem',
						margin: '0 auto',
						width: '90vw'
					}}
				>
					<Fab size="small" margin="10px" sx={{ marginLeft: '.5rem 1.5rem' }}>
						{' '}
						<AddCircleIcon
							onClick={() => this.props.history.push('/celliers/ajouter')}
							sx={{ color: '#641B30' }}
						/>{' '}
					</Fab>
					<Fab size="small">
						{' '}
						<AddShoppingCartOutlinedIcon
							onClick={() => this.props.history.push('/listeachat')}
							sx={{ color: '#641B30' }}
						/>{' '}
					</Fab>
				</Box>
				<section className="liste_celliers">{celliers}</section>
			</Box>
		);
	}
}
