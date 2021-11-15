import React, { useState } from 'react';
import './ListeAchat.css';
import { DataGrid } from '@mui/x-data-grid';  //import { DataGrid } from '@mui/x-data-grid/index-cjs';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
//import { DataGrid } from '@mui/x-data-grid/index-cjs';

export default class ListeAchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      itemsSelected: [],
      bouteilles: [],
      listeAchat: false,
      titre: "",
      idListeAchat: undefined,
      isChecked: false
    }

    this.fetchBouteilles = this.fetchBouteilles.bind(this);
    this.creerListeAchat = this.creerListeAchat.bind(this);
    this.fetchListeAchat = this.fetchListeAchat.bind(this);
    this.effacerListe = this.effacerListe.bind(this);
  }

  componentDidMount() {
    if (!this.props.estConnecte) {
      return this.props.history.push("/connexion");
    }
    
    this.fetchListeAchat();
  }

  fetchListeAchat() {
    fetch('https://rmpdwebservices.ca/webservice/php/listeachat/usager/' + this.props.id_usager, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: 'Basic ' + btoa('vino:vino')
      })
    })
      .then((reponse) => reponse.json())
      .then((donnees) => {
        if (donnees.data) {
          this.setState({ items: donnees.data });
          this.setState({ listeAchat: true });
          this.setState({titre: "Liste d'achat"});
        } else {
          this.fetchBouteilles();
          this.setState({titre: "Inventaire des bouteilles"});
        }
      });
    
      console.log('this.state.items: ', this.state.items);
      console.log("Éxiste listeAchat ? : ", this.state.listeAchat);
  }

  fetchBouteilles() {
    //Ici on doit mettre le nouveau fetch pour avoir la liste de vinos de tous nos celliers avec la quantite, pour savoir sin on doit acheter
    fetch('https://rmpdwebservices.ca/webservice/php/bouteilles/usager/' + this.props.id_usager, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: 'Basic ' + btoa('vino:vino')
      })
    })
      .then((reponse) => reponse.json())
      .then((donnees) => {
        if (donnees.data) {
          this.setState({ items: donnees.data });
        }
      });
  }

  creerListeAchat() {
    console.log("Bouton créer liste d'achat");
    console.log("Colonnes séléctionnées: ", this.state.itemsSelected);
    
    //Il manque capturer la quntité, comment le faire ??????
    //Ou, il faut mettre quantité d'achat ? 

    if ( this.state.itemsSelected.length > 0 ) {
      console.log("Créer liste d'achat");
      var i = 0;
      this.setState({ bouteilles: [] })
      this.state.itemsSelected
              .map((item) => {
                    const temporal = [{id: item.bouteille_id, millesime: item.millesime, quantite: item.quantite_achat}];
                    //console.log("temporal: ", temporal[0]);
                    this.state.bouteilles.push(temporal[0]);
                    i++;
              })
      
      console.log("this.state.bouteilles: ", this.state.bouteilles);
      
      /*
      let donnes = {
          id_usager: this.props.id_usager,
          bouteilles: this.state.bouteilles
      };
      console.log("Donnes: ", donnes);

      const postMethod = {
          method: 'POST',
          headers: {
              'Content-type': 'application/json',
              authorization: 'Basic ' + btoa('vino:vino')
          },
          body: JSON.stringify(donnes)
      };

      fetch('https://rmpdwebservices.ca/webservice/php/listeachat/', postMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
              if (donnees.data) return this.props.history.push("/listeachat");
          });
      */
    } else {
      console.log("Il n'y a pas des bouteilles séléectionnées pour liste d'achat");
    }
    
  }

  effacerListe() {
    //Il faut mettre une fenêtre dialogoe pour confirmation
      
    if (this.state.listeAchat) {
      this.state.items.map(x => {
        console.log("x: ", x.id);
        this.setState({idListeAchat: x.id});
        });

      console.log("Liste d'achat: ", this.state.idListeAchat);
      console.log("Effacer la liste d'achat");

      /*
      const postMethod = {
          method: 'DELETE',
          headers: {
              'Content-type': 'application/json',
              authorization: 'Basic ' + btoa('vino:vino')
          },
      };

      fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, postMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
              if (donnees.data) {
                this.setstate({idListeAchat: false});
              }
                
          });
      */
    } else {
      console.log("Rien se passe...");
    }
    
    /*
    this.setState({ isChecked: !this.state.isChecked });
    console.log('this.state.isChecked ?: ', this.state.isChecked);
    if (!this.state.isChecked) {   //effacer la liste d'achat
      console.log("Effacer la liste d'achat");  */
      //Il faut mettre une fenêtre dialogoe pour confirmation

      /*
      const postMethod = {
          method: 'DELETE',
          headers: {
              'Content-type': 'application/json',
              authorization: 'Basic ' + btoa('vino:vino')
          },
      };

      fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, postMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
              if (donnees.data) return this.props.history.push("/listeachat");
          });
      */
    /*
  } else {
      console.log("Rien se passe...");
    } */
  }

  render() {
    console.log("Éxiste listeAchat ? : ", this.state.listeAchat);

    const colonnes = [
      //{ field: 'bouteille_id', headerName: 'ID', width: 90, type: 'number' },
      { field: 'nom', headerName: 'Nom', width: 230 },
      { field: 'millesime', headerName: 'Millesime', width: 150 },
      { field: 'quantite', headerName: 'Quantite Inventaire', width: 130, type: 'number' },
      { field: 'quantite_achat', headerName: 'Quantite Achat', width: 130, editable: true, type: 'number' },
    ];

    console.log("items: ", this.state.items);

    return (
      <Box className="liste_achat_container" sx={{
        display: "flex", justfyContent: "center", alignItems: "center",
        width: "85vw", flexDirection: "column", borderRadius: "1rem",
        margin: "0 auto", marginTop: "20vh", color: "white",
      }} >

        <span> {this.state.titre} </span>

        <div className="liste_achat_rows" style={{ height: 400, width: '100%' }}>
          <DataGrid rows={this.state.items} columns={colonnes}
            pageSize={5} rowsPerPageOptions={[5]} checkboxSelection disableSelectionOnClick
            
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids)
              const selectedRowData = this.state.items.filter((row) =>
                selectedIDs.has(row.id.toString())
              )
              console.log("selectedRowData: ", selectedRowData);
              this.setState({ itemsSelected: selectedRowData })

            //onSelectionModelChange={itm => 
              //console.log("Selectionné: ", itm)
              //this.setState({ itemsSelected: itm })
            }}
          />
        </div>
        
        {/* <label id='effacer' className="liste_achat_check">Effacer liste d'achat <input type="checkbox"  onChange ={(e) => this.effacerListe()} 
          disabled={ !this.state.listeAchat } /> </label> */}

        <TextField  className="liste_achat_check" label="Effacer liste d'achat" variant="outlined" value="0" type="checkbox" style={{ color: 'white', width: '20%' }}
                    onChange ={(e) => this.effacerListe()} 
                    disabled={ !this.state.listeAchat } /> 

          {/* PAS EFFACER!!!!!
          disabled={ !this.state.listeAchat } */}
        <Button className="button" type="button" onClick={(e) => this.creerListeAchat()}
           disabled={ this.state.listeAchat }> Créer Liste </Button>
      </Box>
    );
  }
} 