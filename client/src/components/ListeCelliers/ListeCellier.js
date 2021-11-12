import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import Cellier from '../Cellier/Cellier';
import './ListeCellier.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box } from '@mui/system';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

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
		if (!this.props.estConnecte) {
			return this.props.history.push('/connexion');
		}
		this.fetchCelliers();
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

		fetch('https://rmpdwebservices.ca/webservice/php/celliers/usager/' + this.props.id_usager, getMethod)
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
				<Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', margin: '0 1.8rem' }}>
				<Typography color="text.primary">Mon Cellier</Typography>
					<Link underline="hover" color="inherit" to="/">
						Celliers
					</Link>
					<Typography color="text.primary">Liste des celliers</Typography>
				</Breadcrumbs>
				<Box sx={{ justifyContent: 'space-between',  alignItems: 'center', gap: "20px" }}>
					<Fab size="small" margin="10px" > <AddCircleIcon onClick={()=> this.props.history.push("/celliers/ajouter")} sx={{ color: '#641B30' }}/> </Fab>
					<Fab size="small"  > <AddShoppingCartOutlinedIcon  onClick={()=> this.props.history.push("/listeachat")} sx={{ color: '#641B30' }} /> </Fab>
				</Box>
				<section className="liste_celliers">
					{celliers}
				</section>
			</Box>
		);
	}
}
