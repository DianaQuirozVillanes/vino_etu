import React from 'react';
import { Link } from 'react-router-dom';
import vinBlanc from '../../vin_blanc.png';
import vinRouge from '../../vin_rouge.png';
import listePays from '../../pays.json';
import './BouteilleCellier.css';
import { Box } from '@mui/system';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';

/** 
 * Component des bouteilles du cellier
 * 
*/
export default class BouteilleCellier extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgSaq: this.props.info.url_img,
			drapeau: ''
		};
	}

	render() {
		return (
			<div className="bouteille_container">
				<div className="titre">{this.props.info.nom}</div>
				<div className="content_container">
					<div className="content">
						<div className="bouteille_img_container">
							<img className="bouteille_img" src={this.state.imgSaq} alt="Bouteille de vin" />
							<img
								src={this.props.info.vino__type_id === '1' ? vinRouge : vinBlanc}
								alt="Couleur du vin"
							/>
						</div>
						{this.props.info.url_saq ? (
							<a href={this.props.info.url_saq}>
								<p className="url_saq">SAQ</p>
							</a>
						) : null}
					</div>
					<div className="bouteille_description">
						<img
							className="bouteille_drapeau"
							src={this.props.info.drapeau}
							width="30"
							alt="Drapeau du pays"
						/>
						<p>{this.props.info.millesime}</p>
						<p>Qté : {this.props.info.quantite}</p>
					</div>
					<Box
						className="bouteille_boutons_container"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '0.5rem',
						}}
					>
						<Fab
							className="bouteille_boutons"
							variant="extended"
							onClick={() => this.props.ajouterAction(this.props.info)}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '.5rem',
								backgroundColor: 'white',
								color: 'black'
							}}
						>
							<AddIcon/>
							Ajouter
						</Fab>
						<Fab
							className="bouteille_boutons"
							variant="extended"
							onClick={() => this.props.retirerAction(this.props.info)}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '.5rem',
								backgroundColor: 'white',
								color: 'black'
							}}
						>
							<RemoveIcon />
							Retirer
						</Fab>
						<Fab
							className="bouteille_boutons bouton_modifier"
							variant="extended"
							onClick={() => this.props.retirerAction(this.props.info)}
							component={Link}
							to={'/cellier/bouteilles/' + this.props.info.id}
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
							Modifier
						</Fab>
					</Box>
				</div>
			</div>
		);
	}
}
