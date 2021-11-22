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
    if (!this.props.estConnecte) {
      return this.props.history.push("/connexion");
    }

    this.fetchBouteilles(); //this.fetchListeAchat();
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
              itemsListeAchat: donnees.data,
              listeAchat: true,
              titre: "Liste d'achat",
              titreBouton: "MODIFIER LISTE"
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
              titreBouton: "CRÉER LISTE"
            });
        }
      });
  }

  cocherListeAchat() {
    //coher les bouteilles et modifier la quantité d'achat
    console.log("mappedItems: ", this.state.mappedItems);
    let bouteillesListeAchat = [];

    this.state.itemsListeAchat
      .map((item) => {
        console.log("bouteille_id: ", item.bouteille_id);
        console.log("quantite: ", item.quantite);
        bouteillesListeAchat.push(item.bouteille_id);

        this.setState(function (state, props) {
          //let quantiteListe = state.mappedItems.find(x => x.id === item.bouteille_id);
          let index = state.mappedItems.findIndex(x => x.id === item.bouteille_id);
          let nouveauTableau = state.mappedItems.slice();

          nouveauTableau[index].quantite_achat = item.quantite;

          return {
            mappedItems: nouveauTableau,
            bouteillesSelectionnes: bouteillesListeAchat
          };
        })
      })
      console.log("bouteillesSelectionnes: ", this.state.bouteillesSelectionnes);
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
            {
              items: donnees.data,
              titre: "Inventaire des bouteilles",
              listeAchat: false,
              titreBouton: "CRÉER LISTE"
            });
          this.afficherBouteilles();
          this.fetchListeAchat();
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
         /* this.setState(function (state, props) {
            let nouveauTableau = state.mappedItems.slice();

            nouveauTableau[index].quantite_achat = item.quantite;

            return {
              mappedItems: nouveauTableau,
              bouteillesSelectionnes: bouteillesListeAchat

            };
          })*/
          this.state.bouteilles.push(temporal); //changer
        })

      console.log("this.state.bouteilles: ", this.state.bouteilles);

      if (this.state.listeAchat) { //Modifier liste d'achat
        let donnes = {
          bouteilles: this.state.bouteilles
        };
        console.log("donnes: ", donnes);

        const putMethod = {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            authorization: 'Basic ' + btoa('vino:vino')
          },
          body: JSON.stringify(donnes)
        };
        console.log("putMethod: ", putMethod);

        fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, putMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
            if (donnees.data) {
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat" });
            }
          });
      } else {  //Créer liste d'achat
        let donnes = {
          id_usager: this.props.id_usager,
          bouteilles: this.state.bouteilles
        };
        console.log("donnes: ", donnes);

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
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat" });
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

  /**
   * 
   * @param {*} ids 
   */
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

    /*if (this.state.listeAchat) {
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
    } else { */
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
    //}

  }

  render() {

    const colonnes = [
      { field: 'nom', headerName: 'Nom', width: 230 },
      { field: 'millesime', headerName: 'Millesime', width: 150 },
      //(!this.state.listeAchat ? { field: 'quantite', headerName: 'Quantité Inventaire', width: 130, type: 'number' } : "") ,
      { field: 'quantite', headerName: 'Quantité Inventaire', width: 130, type: 'number' },
      { field: 'quantite_achat', headerName: 'Quantité Achat', width: 130, editable: true, type: 'number', shrink: true, min: 1 },
    ];
    //console.log("mappedItems: ", this.state.mappedItems);
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
            selectionModel={this.state.bouteillesSelectionnes}
          />
        </div>
        {/*
        <Button
          className="liste_achat_effacer"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={(e) => this.effacerListe()}
          disabled={!this.state.listeAchat} >
          Effacer liste d'achat
        </Button>*/}

        <Fab
          className="liste_achat_effacer"
          variant="outlined"
          onClick={(e) => this.effacerListe()}
          disabled={!this.state.listeAchat}
        >
          {<DeleteIcon />}
          Liste d'achat
        </Fab>

        <Fab
          className="button"
          variant="extended"
          onClick={() => this.creerListeAchat()}
          sx={{ backgroundColor: '#641b30', color: 'white' }}
        >
          <AutoFixHighOutlinedIcon />
          {this.state.titreBouton}
        </Fab>
      </Box>
    );
  }
}
