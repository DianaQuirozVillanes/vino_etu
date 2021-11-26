import React from "react";
import "./Admin.css";
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Fab } from '@mui/material';
import { Box } from "@mui/system";
import LoopIcon from '@mui/icons-material/Loop';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        // Object usagers dans un state.
        this.state = {
            usagers: [],
            loading: false,
            success: false,
        };

        this.importClick = this.importClick.bind(this);
    }

    componentDidMount() {
        // Vérifie la connexion et redirige au besoin.
        if (!window.sessionStorage.getItem('estConnecte')) {
            return this.props.history.push('/connexion');
        }

        // Titre du document
        this.props.title('Admin');

        // Get les informations de l'usager.
        this.getUsagers()
    }

    componentDidUpdate() {
        if (!window.sessionStorage.getItem('estConnecte')) {
            return this.props.history.push('/connexion');
        }
    }

    getUsagers() {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Basic ' + btoa('vino:vino')
            }
        }

        fetch("https://rmpdwebservices.ca/webservice/php/usagers/", options)
            .then(reponse => reponse.json())
            .then((donnees) => {
                this.setState({
                    usagers: donnees.data
                })
            });
    }

    importClick() {
        if (!this.state.loading) {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-type': 'applicaiton/json',
                    'authorization': 'Basic ' + btoa('vino:vino')
                }
            }

            this.setState({
                success: false,
                loading: true
            });

            fetch("https://rmpdwebservices.ca/webservice/php/saq/", options)
                .then(response => {
                    if (response.status == 200) {
                        console.log('200')
                        this.setState({
                            success: true,
                            loading: false
                        });
                    }
                })
        }
    }

    render() {
        // Assigner des nom aux 'fields' de la table.
        const columns = [
            { field: 'prenom', headerName: 'Prénom', width: 80 },
            { field: 'nom', headerName: 'Nom', width: 80 },
            {
                field: 'courriel',
                headerName: 'Courriel',
                type: 'string',
                width: 150,
            }
        ];

        // 'Mapping' des 'key' & 'values' de chaque usager.
        const users = this.state.usagers.map(user => {
            return {
                id: parseInt(user.id_usager),
                prenom: user.prenom,
                nom: user.nom,
                courriel: user.courriel
            }
        })

        const buttonSx = {
            ...(this.state.success && {
                backgroundColor: '#641b30',
                '&:hover': {
                    backgroundColor: '#641b30 !important',
                },
            }),
            backgroundColor: '#641b30',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '.5rem',
            position: 'relative',
            margin: '0 auto',
            marginBottom: '1rem'
        };

        // Affichage.
        return (
            <>
                <Fab
                    variant="extended"
                    sx={buttonSx}
                    disabled={this.state.loading}
                    onClick={this.importClick}
                >
                    <LoopIcon /> Mise à jour SAQ
                    {this.state.loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: 'green',
                                position: 'absolute',
                                transform: 'rotateX(90deg)'
                            }}
                        />
                    )}
                </Fab>

                <span className="titre" >Liste des usagers</span>


                <div style={{
                    height: 500, width: '85vw',
                    margin: '0 auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: '.5rem'
                }}>
                    <DataGrid style={{ color: 'white', border: 'none', margin: '1rem .5rem' }}
                        rows={users}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </>
        );
    }
}