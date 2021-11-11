import React from 'react';

import './BouteilleSAQ.css';

/** 
 * Component de l'affichage de la recherche des bouteilles de la SAQ
 * 
*/
export default class BouteilleSAQ extends React.Component {
	render() {
		return (
			<li className="une-bouteille-saq" onClick={() => this.props.choixBouteille(this.props.info)}>
				{this.props.info.nom}
				{this.props.info.table === 'cellier' ? ` (${this.props.info.quantite})` : ''}
			</li>
		);
	}
}
