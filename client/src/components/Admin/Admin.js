import React from "react";
import "./Admin.css";
import { DataGrid } from '@mui/x-data-grid';
import { Breadcrumbs, Link, Typography } from '@mui/material';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);

        // Object usagers dans un state.
        this.state = {
            usagers: []
        };
    }

    componentDidMount() {
        // Vérifie la connexion et redirige au besoin.
        if (!window.sessionStorage.getItem('estConnecte')) {
            return this.props.history.push('/connexion');
        }

        // Titre du document
        document.title = this.props.title;

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

        // Affichage.
        return (
            <>
                <Breadcrumbs aria-label="breadcrumb" sx={{ display: 'flex', margin: '0 1.8rem', marginBottom: '1rem' }}>
                    <Link underline="hover" color="inherit" onClick={() => this.props.history.push('/')}>
                        Mon Cellier
                    </Link>

                    <Typography color="text.primary">Panneau admin</Typography>
                </Breadcrumbs>

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