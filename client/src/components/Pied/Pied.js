import React from "react";
import './Pied.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WineBarIcon from '@mui/icons-material/WineBar';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box } from "@mui/system";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

export default class Pied extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isListeAchatMenuOpen: false,
			anchorElListeAchatMenu: null,
		}

		this.openListeAchatMenu = this.openListeAchatMenu.bind(this);
		this.closeListeAchatMenu = this.closeListeAchatMenu.bind(this);
	}

	openListeAchatMenu(e) {
		this.setState({ isListeAchatMenuOpen: true, anchorElListeAchatMenu: e.currentTarget });
	}

	closeListeAchatMenu() {
		this.setState({ isListeAchatMenuOpen: false });
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
					<BottomNavigation showLabels
						className="bottomnav"
						sx={{
							width: '100vw',
							position: 'fixed',
							bottom: 19,
							left: 0,
							right: 0,
							zIndex: 1,
							paddingTop: .5,
							backgroundColor: '#641B30',
							display: 'flex',
						}}
					>
						<BottomNavigationAction
							label="Celliers"
							value="recents"
							icon={<FormatListBulletedIcon />}
							onClick={() => this.props.history.push("/celliers/liste")}
						/>

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

						
					</BottomNavigation>
					<Box sx={{ width: '100vw', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1, height: '20px', backgroundColor: '#641B30' }}>
					</Box>
				</>
			);
		}
	}
}