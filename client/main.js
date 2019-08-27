import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from '../imports/ui/App.js'; 
import './main.html';
import LandingPage from '../imports/ui/LandingPage.js';
import NewSaladeVentaForm from '../imports/ui/NewSaladeVentaForm.js';
import NewDispositivoForm from '../imports/ui/NewDispositivoForm.js';
import NewEmpresaForm from '../imports/ui/NewEmpresaForm.js';
import EditSaladeVentaForm from '../imports/ui/EditSaladeVentaForm.js';
import EditDispositivoForm from '../imports/ui/EditDispositivoForm.js';
import EditEmpresaForm from '../imports/ui/EditEmpresaForm.js'
import ViewSalasdeVenta from '../imports/ui/ViewSalasdeVenta.js';
import ViewEmpresas from '../imports/ui/ViewEmpresas.js';
import SalaDeVentasDetails from '../imports/ui/SalaDeVentasDetails.js';


Meteor.startup(() => {
  render(
    <Router>
    <App>
      <Switch>
        <Route exact path="/" component={LandingPage}/>
        <Route  path="/newSalaVenta" component={NewSaladeVentaForm}/>
        <Route  path="/editSalaVenta" component={EditSaladeVentaForm}/>
        <Route  path="/salasVenta" component={ViewSalasdeVenta}/>
        <Route  path="/salaDeVentasDetails" component={SalaDeVentasDetails}/>
        <Route  path="/newDispositivo" component={NewDispositivoForm}/>
        <Route  path="/editDispositivo" component={EditDispositivoForm}/>
        <Route  path="/newEmpresa" component={NewEmpresaForm}/>
        <Route  path="/empresas" component={ViewEmpresas}/>
        <Route path="/editEmpresa" component={EditEmpresaForm}/>
      </Switch>
    </App>
  </Router>
  ,document.getElementById('target'));
});
