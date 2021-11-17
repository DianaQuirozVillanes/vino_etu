import React from 'react';
import './Entete.css';
import menu from '../../Menu.png';
import logo from '../../logo.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
<<<<<<< HEAD
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button } from '@mui/material';
=======
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
>>>>>>> a41cc0d35df877a00a11d38a418888d340245c86

/* Variables de styles */
const appBarStyles = {
	backgroundColor: 'rgba(0, 0, 0, .8)',
	position: 'relative'
};

const toolBarStyles = {
	display: 'flex',
	//justifyContent: 'space-between',
	height: 50,
	padding: 0
};

export default class Entete extends React.Component {
	constructor(props) {
<<<<<<< HEAD
		super(props)

		console.log(this.props)
	}
=======
		super(props);
		console.log("props: ", props);
	}

>>>>>>> a41cc0d35df877a00a11d38a418888d340245c86
	render() {
		// return (
		// 	<Box>
		// 		<AppBar sx={appBarStyles}>
		// 			<Toolbar sx={toolBarStyles}>
		// 				<img className="logo" src={logo} alt="Logo" />
		// 				<img className="menu" src={menu} alt="Menu" />
		// 			</Toolbar>
		// 		</AppBar>
		// 	</Box>
		// );

		return (
			<Box sx={{ paddingBottom: '2rem' }}>
				<AppBar sx={appBarStyles}>
					<Toolbar sx={toolBarStyles}>
<<<<<<< HEAD
						<Button
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								color: "white",
								margin: 0,
								left: 0
							}}
							onClick={() => this.props.history.goBack()}>
							<ArrowBackIosNewIcon />
							<span>Retour</span>
						</Button>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'end',
								alignItems: 'center',
								gap: '1rem',
								width: '100%',
								height: '100%'
							}}
						>
							<img className="logo" style={{ width: '50%', height: '100%', objectFit: 'cover' }} src={logo} alt="Logo" />
						</Box>
=======
						{/*<Button sx={{color: "white"}}
							onClick={() => this.props.history.push("/listeachat")}>
							<ArrowBackIosNewIcon/>
							Retour
						</Button> */}
						<img className="logo" src={logo} alt="Logo" />
						<img  />
>>>>>>> a41cc0d35df877a00a11d38a418888d340245c86
					</Toolbar>
				</AppBar>
			</Box>
		);
	}
}
