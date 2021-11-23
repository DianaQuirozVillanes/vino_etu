import React from "react";
import './Pied.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WineBarIcon from '@mui/icons-material/WineBar';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Menu, MenuItem } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { Box } from "@mui/system";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

export default class Pied extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isListeAchatMenuOpen: false,
			anchorElListeAchatMenu: null,
			isCelliersMenuOpen: false,
			anchorElCelliersMenu: null,
		}

		this.openListeAchatMenu = this.openListeAchatMenu.bind(this);
		this.closeListeAchatMenu = this.closeListeAchatMenu.bind(this);
		this.openCelliersMenu = this.openCelliersMenu.bind(this);
		this.closeCelliersMenu = this.closeCelliersMenu.bind(this);
	}

	openListeAchatMenu(e) {
		this.setState({ isListeAchatMenuOpen: true, anchorElListeAchatMenu: e.currentTarget });
	}

	closeListeAchatMenu() {
		this.setState({ isListeAchatMenuOpen: false });
	}

	openCelliersMenu(e) {
		this.setState({ isCelliersMenuOpen: true, anchorElCelliersMenu: e.currentTarget });
	}

	closeCelliersMenu() {
		this.setState({ isCelliersMenuOpen: false })
	}

	render() {

		if (!window.sessionStorage.getItem('estConnecte')) {
			return (
				<>
					<BottomNavigation showLabels sx={{ width: '100vw', position: 'fixed', bottom: 19, left: 0, right: 0, zIndex: 1, paddingTop: .5, backgroundColor: '#641B30' }}>
						<BottomNavigationAction
							label="Se connecter"
							value="favorites"
							icon={<LoginIcon />}
							onClick={() => this.props.history.push("/")}
						/>

						<BottomNavigationAction
							label="S'enregistrer"
							value="folder"
							icon={<PersonAddIcon />}
							onClick={() => this.props.history.push("/inscription")} />
					</BottomNavigation>
					<Box sx={{ width: '100vw', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1, height: '20px', backgroundColor: '#641B30' }}>
					</Box>
				</>
			);
		} else {
			return (
				<>
					<BottomNavigation showLabels sx={{ width: '100vw', position: 'fixed', bottom: 19, left: 0, right: 0, zIndex: 1, paddingTop: .5, backgroundColor: '#641B30' }}>
						<BottomNavigationAction
							label="Celliers"
							value="recents"
							icon={<FormatListBulletedIcon />}
							//onClick={(e) => this.openCelliersMenu(e)}
							onClick={() => this.props.history.push("/celliers/liste")}
						/>

						<AddCircleOutlineOutlinedIcon sx={{ transform: 'translateX(550%)', width: 15, color: 'white' }} />
						<BottomNavigationAction
							label="Nouvelle bouteille"
							value="favorites"
							icon={<WineBarIcon />}
							onClick={() => this.props.history.push("/bouteille/ajout")}
						/>

						<BottomNavigationAction
							label="Liste d'achat"
							value="folder"
							icon={<AddShoppingCartOutlinedIcon />}
							onClick={() => this.props.history.push("/listeachat")}
						/>

						<Menu
							open={this.state.isCelliersMenuOpen}
							anchorEl={this.state.anchorElCelliersMenu}
							onClose={() => this.closeCelliersMenu()}
							PaperProps={{
								style: {
									transform: 'translateY(-40%)',
								}
							}}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						>

							<MenuItem onClick={() => {this.closeCelliersMenu(); this.props.history.push("/celliers/liste")}} sx={{ display: 'flex', gap: '.5rem' }}>
								<FormatListNumberedIcon onClick={() => {this.closeCelliersMenu(); this.props.history.push("/celliers/liste")}} /> Liste des celliers
							</MenuItem>

							<MenuItem onClick={() => {this.closeCelliersMenu(); this.props.history.push("/celliers/ajouter")}} sx={{ display: 'flex', gap: '.5rem' }}>
								<PlaylistAddIcon onClick={() => {this.closeCelliersMenu(); this.props.history.push("/celliers/ajouter")}} /> Ajouter un cellier
							</MenuItem>
						</Menu>
					</BottomNavigation>
					<Box sx={{ width: '100vw', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1, height: '20px', backgroundColor: '#641B30' }}>
					</Box>
				</>
			);
		}
	}
}