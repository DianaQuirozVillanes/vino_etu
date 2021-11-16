import React from 'react';
import './ListeAchat.css';
import { DataGrid } from '@mui/x-data-grid';  //import { DataGrid } from '@mui/x-data-grid/index-cjs';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
      isChecked: false,
      mappedItems: []
    }

    this.fetchBouteilles = this.fetchBouteilles.bind(this);
    this.creerListeAchat = this.creerListeAchat.bind(this);
    this.fetchListeAchat = this.fetchListeAchat.bind(this);
    this.effacerListe = this.effacerListe.bind(this);
    this.afficherBouteilles = this.afficherBouteilles.bind(this);
    this.onCheckbox = this.onCheckbox.bind(this);
    this.onModificationQte = this.onModificationQte.bind(this);
  }

  componentDidMount() {
    if (!this.props.estConnecte) {
      return this.props.history.push("/connexion");
    }

    this.fetchListeAchat();
  }

  componentDidUpdate() {
    console.log('UPDATE', this.state.itemsSelected)
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
          this.setState(
            {
              items: donnees.data,
              listeAchat: true,
              titre: "Liste d'achat"
            }
          );
          this.state.items.map(x => {
            this.setState({ idListeAchat: x.id });
          });
          this.afficherBouteilles();
        } else {
          this.fetchBouteilles();
          this.setState(
            { 
              titre: "Inventaire des bouteilles",
              listeAchat: false
            });
        }
      });
  }

  fetchBouteilles() {
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
          this.setState(
            { items: donnees.data,
              titre: "Inventaire des bouteilles",
              listeAchat: false
            });
          this.afficherBouteilles();
        }
      });
  }

  creerListeAchat() {
    console.log("Colonnes séléctionnées: ", this.state.itemsSelected);

    if (this.state.itemsSelected.length > 0) {
      console.log("Créer liste d'achat");

      this.setState({ bouteilles: [] })
      this.state.itemsSelected
        .map((item) => {
          const temporal = { bouteille_id: item.id, millesime: item.millesime, quantite: item.quantite_achat };
          this.state.bouteilles.push(temporal);
        })

      console.log("this.state.bouteilles: ", this.state.bouteilles);

      let donnes = {
          id_usager: this.props.id_usager,
          bouteilles: this.state.bouteilles
      };
      
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
              if (donnees.data) {
                this.fetchListeAchat();
                this.setState({ titre: "Liste d'achat" });
              }
          });
      
    } else {
      console.log("Il n'y a pas des bouteilles séléectionnées pour liste d'achat");
    }
  }

  effacerListe() {
    //Il faut mettre une fenêtre dialogoe pour confirmation ???

    if (this.state.listeAchat) {
      console.log("Liste d'achat: ", this.state.idListeAchat);
      console.log("Effacer la liste d'achat");

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
                this.fetchBouteilles();
              }
          });
      
    } else {
      console.log("Rien se passe...");
    }
  }

  onModificationQte(e) {
    this.setState(function (state, props) {
      let index = state.mappedItems.findIndex(x => x.id === e.id);
      let nouveauTableau = state.mappedItems.slice();

      nouveauTableau[index].quantite_achat = e.value;

      return {
        mappedItems: nouveauTableau
      };
    });
  }

  onCheckbox(ids) {
    const selectedIDs = new Set(ids)

    const selectedRowData = this.state.mappedItems.filter((row) => {
      if (selectedIDs.has(row.id)) {
        return row;
      }
    })

    this.setState({ itemsSelected: selectedRowData })
  }

  afficherBouteilles() {
    let arr = [...this.state.mappedItems];

    if (this.state.listeAchat) {
      const map = this.state.items.map(bteObj => {
        return {
          id: bteObj.bouteille_id,
          nom: bteObj.nom,
          millesime: bteObj.millesime,
          quantite_achat: bteObj.quantite
        }
      })

      arr = map;
      this.setState({ mappedItems: arr })
    } else {
      const map = this.state.items.map(bteObj => {
        return {
          id: bteObj.bouteille_id,
          nom: bteObj.nom,
          millesime: bteObj.millesime,
          quantite: bteObj.quantite,
          quantite_achat: this.state.mappedItems.find(x => x.id === bteObj.bouteille_id) === undefined
            ? 1 : this.state.mappedItems.find(x => x.id === bteObj.bouteille_id).qte
        }
      })
  
      arr = map;
      this.setState({ mappedItems: arr })
    }  
    
  }

  render() {
    if (this.state.listeAchat) {
      var lesColonnes = [
        { field: 'id', headerName: 'ID', width: 90, type: 'number' },
        { field: 'nom', headerName: 'Nom', width: 230 },
        { field: 'millesime', headerName: 'Millesime', width: 150 },
        { field: 'quantite_achat', headerName: 'Quantité Achat', width: 130, editable: true, type: 'number',  shrink: true , min: 1 },
      ];  
    } else {
      var lesColonnes = [
        { field: 'id', headerName: 'ID', width: 90, type: 'number' },
        { field: 'nom', headerName: 'Nom', width: 230 },
        { field: 'millesime', headerName: 'Millesime', width: 150 },
        { field: 'quantite', headerName: 'Quantité Inventaire', width: 130, type: 'number' },
        { field: 'quantite_achat', headerName: 'Quantité Achat', width: 130, editable: true, type: 'number',  shrink: true , min: 1 },
      ];  
    }

    const colonnes = lesColonnes;

    return (
      <Box className="liste_achat_container" sx={{
        display: "flex", justfyContent: "center", alignItems: "center",
        width: "85vw", flexDirection: "column", borderRadius: "1rem",
        margin: "0 auto", marginTop: "20vh", color: "white",
      }} >

        <span> {this.state.titre} </span>

        <div className="liste_achat_rows" style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={this.state.mappedItems}
            columns={colonnes}
            onCellEditCommit={(e) => this.onModificationQte(e)}
            onRow
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            checkboxSelection
            onSelectionModelChange={(ids) => this.onCheckbox(ids)}
          />
        </div>

        <Button 
          className="liste_achat_effacer" 
          variant="outlined" 
          startIcon={<DeleteIcon />}
          onClick={(e) => this.effacerListe()}
          disabled={!this.state.listeAchat} > 
          Effacer liste d'achat
        </Button>

        <Button 
          className="button" 
          type="button" 
          onClick={(e) => this.creerListeAchat()}
          disabled={this.state.listeAchat}> 
          Créer Liste 
        </Button>
      </Box>
    );
  }
}
