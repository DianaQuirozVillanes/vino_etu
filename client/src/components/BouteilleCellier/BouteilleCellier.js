import React from 'react';
import { Link } from 'react-router-dom';
import vinBlanc from '../../vin_blanc.png';
import vinRouge from '../../vin_rouge.png';
import vinRose from '../../vin_rose.png';
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
				<div className="titre_vin">{this.props.info.nom}</div>
				<div className="content_container">
					<div className="content">
						<div className="bouteille_img_container">
							<img className="bouteille_img" src={this.state.imgSaq} alt="Bouteille de vin" />
							<img className="pastille_img"
								src={this.props.info.vino__type_id == '1' ? vinRouge : this.props.info.vino__type_id == '2' ? vinBlanc : this.props.info.vino__type_id == '3' ? vinRose: ''}
								alt="Couleur du vin"
							/>
						</div>

					</div>
					<div className="bouteille_description">
						{this.props.info.url_saq ? (
							<a href={this.props.info.url_saq} className="url_saq">SAQ</a>
						) : null}
						<img
							className="bouteille_drapeau"
							src={this.props.info.drapeau}
							width="30"
							alt="Pays"
						/>
						<span>{this.props.info.millesime}</span>
						<span>Qté : {this.props.info.quantite}</span>
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
							<AddIcon />
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
