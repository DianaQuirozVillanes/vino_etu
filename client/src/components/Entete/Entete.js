import React from 'react';
import './Entete.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button, Fab, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/* Variables de styles */
const appBarStyles = {
	backgroundColor: 'rgba(0, 0, 0, .8)',
	position: 'relative'
};

const toolBarStyles = {
	display: 'flex',
	justifyContent: 'space-between',
	height: 50,
	padding: 0,
	margin: '0 .5rem'
};

export default class Entete extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isAccMenuOpen: false,
			anchorElAccMenu: null,
		}

		this.openAccMenu = this.openAccMenu.bind(this);
		this.closeAccMenu = this.closeAccMenu.bind(this);
	}

	componentDidMount() {
		document.title = this.props.title;
	}

	openAccMenu(e) {
		this.setState({ isAccMenuOpen: true, anchorElAccMenu: e.currentTarget });
	}

	closeAccMenu() {
		this.setState({ isAccMenuOpen: false });
	}

	render() {
		return (
			<Box sx={{ paddingBottom: '2rem' }}>
				<AppBar sx={appBarStyles}>
					<Toolbar sx={toolBarStyles}>
						<Button
							sx={{
								display: 'flex',
								alignItems: 'center',
								textAlign: 'left',
								color: "white",
								margin: 0,
								justifyContent: 'flex-start'
							}}
							onClick={() => this.props.history.goBack()}>
							<ArrowBackIosNewIcon />
							<span>Retour</span>
						</Button>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							{this.props.title}
						</Box>

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'end',
								alignItems: 'center',
								gap: '1rem',
								height: '100%',
								visibility: !window.sessionStorage.getItem('estConnecte') ? 'hidden' : 'visible'
							}}
						>
							<Fab size="small" color="white" aria-label="add" onClick={(e) => this.openAccMenu(e)}>
								<AccountCircleIcon />
							</Fab>

							<Menu
								open={this.state.isAccMenuOpen}
								anchorEl={this.state.anchorElAccMenu}
								onClose={() => this.closeAccMenu()}
								PaperProps={{
									style: {
										transform: 'translateY(25%)',
									}
								}}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
							>
								{window.sessionStorage.getItem('estAdmin') ? (

									<MenuItem onClick={() => { this.closeAccMenu(); this.props.history.push("/admin") }} sx={{ display: 'flex', gap: '.5rem', border: 'none' }}>
										<AdminPanelSettingsIcon onClick={() => this.props.history.push("/admin")} /> Panneau admin
									</MenuItem>

								) : ('')}
								<MenuItem onClick={() => { this.closeAccMenu(); this.props.history.push("/compte/modifier") }} sx={{ display: 'flex', gap: '.5rem' }}>
									<AccountCircleIcon onClick={() => this.props.history.push("/compte/modifier")} /> Mon profil
								</MenuItem>

								<MenuItem onClick={() => this.props.logout()} sx={{ display: 'flex', gap: '.5rem' }}>
									<LogoutIcon onClick={() => this.props.logout()} /> Se déconnecter
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</AppBar>
			</Box>
		);
	}
}
