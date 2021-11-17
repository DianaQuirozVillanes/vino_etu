import React from 'react';
import './Dialogue.css';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default class Dialogue extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			valeur: '1',
			titre: '',
			action: ''
		};

		this.handleClose = this.handleClose.bind(this);
	}
	/**
	 * @param  {} previousProps
	 * @param  {} previousState
	 */
	componentDidUpdate(previousProps, previousState) {
		if (this.state.open && !this.props.open) {
			this.setState({ open: false });
		} else if (!this.state.open && !previousState.open) {
			this.setState({ open: true });
			this.setState({ titre: this.props.titre });
			this.setState({ action: this.props.action });
		}
	}

	render() {
		return (
			<div>
				<Dialog open={this.props.open} onClose={this.handleClose}>
					<DialogTitle>{this.state.titre}</DialogTitle>
					<DialogContent>
						<DialogContentText>Veuillez indiquer la quantité à {this.state.action}</DialogContentText>
						<TextField
							autoFocus
							id="number"
							label="Quantité"
							type="number"
							fullWidth
							variant="standard"
							value={this.state.valeur}
							onChange={(e) => this.setState({ valeur: e.target.value })}
							inputProps={{ min: '1' }}
						/>
					</DialogContent>
					<DialogActions>
						<Button className="dialog_button" onClick={this.handleClose}>
							Annuler
						</Button>
						<Button
							className="dialog_button"
							onClick={() => {
								this.props.changerQuantite(this.state.valeur);
								this.setState({ valeur: '1' });
							}}
						>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
