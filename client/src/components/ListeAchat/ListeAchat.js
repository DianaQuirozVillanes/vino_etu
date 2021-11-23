import React from 'react';
import './ListeAchat.css';
import { DataGrid } from '@mui/x-data-grid';  //import { DataGrid } from '@mui/x-data-grid/index-cjs';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
//import { DataGrid } from '@mui/x-data-grid/index-cjs';
import { Fab } from '@mui/material';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';

export default class ListeAchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      itemsSelected: [],
      itemsListeAchat: [],
      bouteilles: [],
      listeAchat: false,
      titre: "",
      idListeAchat: undefined,
      isChecked: false,
      mappedItems: [],
      titreBouton: "",
      bouteillesSelectionnes: []
    }

    this.fetchBouteilles = this.fetchBouteilles.bind(this);
    this.creerListeAchat = this.creerListeAchat.bind(this);
    this.fetchListeAchat = this.fetchListeAchat.bind(this);
    this.effacerListe = this.effacerListe.bind(this);
    this.afficherBouteilles = this.afficherBouteilles.bind(this);
    this.onCheckbox = this.onCheckbox.bind(this);
    this.onModificationQte = this.onModificationQte.bind(this);
    this.cocherListeAchat = this.cocherListeAchat.bind(this);
  }

  componentDidMount() {
    if (!window.sessionStorage.getItem('estConnecte')) {
      return this.props.history.push("/connexion");
    }

    this.props.title("Liste d'achat");

    this.fetchBouteilles();;
  }

  componentDidUpdate() {
    console.log('UPDATE', this.state.itemsSelected)
  }

  fetchListeAchat() {
    fetch('https://rmpdwebservices.ca/webservice/php/listeachat/usager/' + window.sessionStorage.getItem('id_usager'), {
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
              itemsListeAchat: donnees.data,
              listeAchat: true,
              titre: "Liste d'achat",
              titreBouton: "Modifier"
            }
          );
          this.state.itemsListeAchat.map(x => {
            this.setState({ idListeAchat: x.id });
          });
          //this.afficherBouteilles();
          console.log("Liste d'achat: ", this.state.itemsListeAchat);
          this.cocherListeAchat();
        } else {
          //this.fetchBouteilles();
          this.setState(
            {
              titre: "Inventaire des bouteilles",
              listeAchat: false,
              titreBouton: "Créer"
            });
        }
      });
  }

  cocherListeAchat() {
    //coher les bouteilles et modifier la quantité d'achat
    let bouteillesListeAchat = [];

    this.state.itemsListeAchat
      .map((item) => {
        bouteillesListeAchat = [...bouteillesListeAchat, parseInt(item.bouteille_id)]

        this.setState(function (state, props) {
          let index = state.mappedItems.findIndex(x => x.id == item.bouteille_id);
          let nouveauTableau = state.mappedItems.slice();

          nouveauTableau[index].quantite_achat = item.quantite;

          return {
            mappedItems: nouveauTableau,
            bouteillesSelectionnes: bouteillesListeAchat
          };
        })
      })
  }

  fetchBouteilles() {
    fetch('https://rmpdwebservices.ca/webservice/php/bouteilles/usager/' + window.sessionStorage.getItem('id_usager'), {
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
              titre: "Inventaire des bouteilles",
              //listeAchat: false,
              titreBouton: "CRÉER LISTE"
            });
          this.afficherBouteilles()
          this.fetchListeAchat();
        }
      });
  }

  creerListeAchat() {
    console.log("Colonnes séléctionnées: ", this.state.bouteillesSelectionnes);
    console.log("mappedItems: ", this.state.mappedItems);
    if (this.state.bouteillesSelectionnes.length > 0) {
      console.log("Créer liste d'achat");

      this.setState({ bouteilles: [] })
      this.state.bouteillesSelectionnes
        .map((item) => {
          let index = this.state.mappedItems.findIndex(x => x.id == item);
          //let nouveauTableau = this.state.mappedItems.slice();
          console.log("Dato: ", this.state.mappedItems[index].nom);
          //nouveauTableau[index].quantite_achat = item.quantite;

          const temporal = { id: this.state.mappedItems[index].id, millesime: this.state.mappedItems[index].millesime, quantite: this.state.mappedItems[index].quantite_achat };
          this.state.bouteilles.push(temporal); //changer
        })

      console.log("this.state.bouteilles: ", this.state.bouteilles);
      console.log("this.state.listeAchat ", this.state.listeAchat);
      if (this.state.listeAchat) { //Modifier liste d'achat
        let donnes = {
          bouteilles: this.state.bouteilles
        };
        console.log("donnes: ", donnes);

        const putMethod = {
          method: 'PUT',
          headers: new Headers({
            'Content-type': 'application/json',
            authorization: 'Basic ' + btoa('vino:vino')
          }),
          body: JSON.stringify(donnes)
        };
        console.log("putMethod: ", putMethod);

        fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, putMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
            if (donnees.data) {
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat", listeAchat: true });
            }
          });
      } else {  //Créer liste d'achat
        let donnes = {
          id_usager: window.sessionStorage.getItem('id_usager'),
          bouteilles: this.state.bouteilles
        };
        console.log("donnes: ", donnes);

        const postMethod = {
          method: 'POST',
          headers: new Headers({
            'Content-type': 'application/json',
            authorization: 'Basic ' + btoa('vino:vino')
          }),
          body: JSON.stringify(donnes)
        };

        fetch('https://rmpdwebservices.ca/webservice/php/listeachat/', postMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
            if (donnees.data) {
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat", listeAchat: true });
            }
          });
      }

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
            this.setState({ bouteillesSelectionnes: [], listeAchat: false });
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
        mappedItems: nouveauTableau,
        itemsSelected: [nouveauTableau[index]]
      };
    });
  }

  /**
   * 
   * @param {Set} ids 
   */
  onCheckbox(ids) {
    const selectedIDs = new Set(ids)
    console.log("selectedIDs: ", selectedIDs);

    const selectedRowData = this.state.mappedItems.filter((row) => {
      if (selectedIDs.has(row.id)) {
        console.log('row', row);
        return row;
      }
    })

    console.log("selectedRowData: ", selectedRowData);
    this.setState(function (state, props) {
      console.log(state.bouteillesSelectionnes);
      let arr = [];
      Array.from(selectedIDs).map((x) => arr.push(x));

      return {
        itemsSelected: selectedRowData,
        //bouteillesSelectionnes: selectedIDs //No pero si
        bouteillesSelectionnes: arr
        //bouteillesSelectionnes: ids//si
        //bouteillesSelectionnes: selectedRowData
      }

      /*
      if () { //Si this.state.itemsSelected está en bouteillesSelectionnes, quitarlo sino agregarlo
        
      }
      */
     
    });
    //console.log("id de itemsSelected: ", this.state.itemsSelected[0]);
    console.log("itemsSelected: ", this.state.itemsSelected);
    //console.log("selectedRowData: ", selectedRowData);
    console.log("selectedIDs 2: ", selectedIDs);
    console.log("bouteillesSelectionnes: ", this.state.bouteillesSelectionnes);
  }

  afficherBouteilles() {
    let arr = [...this.state.mappedItems];
    console.log("Existe listeAchat? ", this.state.listeAchat);
    if (this.state.listeAchat) {
      const mapa = this.state.items.map(bteObj => {
        return {
          id: bteObj.bouteille_id,
          nom: bteObj.nom,
          millesime: bteObj.millesime,
          quantite: bteObj.quantite,
          quantite_achat: this.state.mappedItems.find(x => x.id === bteObj.bouteille_id) === undefined
            ? 1 : this.state.mappedItems.find(x => x.id === bteObj.bouteille_id).quantite_achat
        }
      })
      arr = mapa;
      this.setState({ mappedItems: arr })

    } else {
      const mapa = this.state.items.map(bteObj => {
        return {
          id: bteObj.bouteille_id,
          nom: bteObj.nom,
          millesime: bteObj.millesime,
          quantite: bteObj.quantite,
          quantite_achat: 1
        }
      })
      arr = mapa;
      this.setState({ mappedItems: arr })
    }

  }

  render() {

    const colonnes = [
      { field: 'nom', headerName: 'Nom', width: 230 },
      { field: 'millesime', headerName: 'Millesime', width: 150 },
      //(!this.state.listeAchat ? { field: 'quantite', headerName: 'Quantité Inventaire', width: 130, type: 'number' } : "") ,
      { field: 'quantite', headerName: 'Quantité Inventaire', width: 130, type: 'number' },
      { field: 'quantite_achat', headerName: 'Quantité Achat', width: 130, editable: true, type: 'number', shrink: true, min: 1 },
    ];

    //console.log('bouteillesSelectionnes', this.state.bouteillesSelectionnes)
    return (
      <Box className="liste_achat_container" sx={{
        display: "flex", justfyContent: "center", alignItems: "center",
        width: "85vw", flexDirection: "column", borderRadius: "1rem",
        margin: "0 auto", marginTop: "10vh", color: "white",
      }} >

        <Box className="liste_achat_rows" style={{ height: 400, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 0 }}>
          <DataGrid
            rows={this.state.mappedItems}
            columns={colonnes}
            onCellEditCommit={(e) => this.onModificationQte(e)}
            onRow
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            checkboxSelection
            onSelectionModelChange={(ids) => this.onCheckbox(ids) }
            // console.log("ids: ", ids)
            selectionModel={this.state.bouteillesSelectionnes}
          />
        </Box>
        {/*
        <Button
          className="liste_achat_effacer"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={(e) => this.effacerListe()}
          disabled={!this.state.listeAchat} >
          Effacer liste d'achat
        </Button>*/}

        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between'
          }}
        >
          <Fab
            className="button"
            variant="extended"
            onClick={() => this.creerListeAchat()}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '.5rem',
              backgroundColor: '#641b30', color: 'white'
            }}
          >
            <AutoFixHighOutlinedIcon />
            {this.state.titreBouton}
          </Fab>
          <Fab
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '.5rem',
              backgroundColor: '#641b30', color: 'white'
            }}
            className="button"
            variant="extended"
            onClick={(e) => this.effacerListe()}
            disabled={!this.state.listeAchat}
          >
            {<DeleteIcon />}
            Supprimer
          </Fab>
        </Box>
      </Box>
    );
  }
}