import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {SalaDeVenta} from '../api/salaDeVenta.js'
import {Empresa} from '../api/empresa.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import Dialog from 'react-bootstrap-dialog';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class EditSaladeVentaForm extends Component {

  constructor(props){
    super(props);

    this.state={
        name: '',
        cityArr: ['Bogotá', 'Cali', 'Medellín', 'Barranquilla', 'Cartagena', 'Soledad', 'Cúcuta','Soacha','Ibagué','Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Armenia', 'Villavicencio'],
        city: 'Bogotá',
        company: '',
        turnOnHour: '',
        turnOffHour:'',
        idDispEnCabeza:'',
        hasSettings: false
    };
    this.state.salaDeVenta = localStorage.getItem('idSalaDeVentas');
    //bind
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.return= this.return.bind(this);

    
  }

    // EventHandlers

    handleChange(event) {
      const value = event.target.value;
      this.setState({
        [event.target.name]: value
      });

   /** 
      if(typeof this.props.user.profile === "undefined")
      {
        window.alert("You need to update your profile information first");
        window.location.assign("/profile");
      }*/
    }

    handleSubmit(event) {
      event.preventDefault();
      try{
      let salaDeVenta ={
        name: this.state.name,
        city:this.state.city,
        company: this.state.company,
        turnOnHour: this.state.turnOnHour,
        turnOffHour: this.state.turnOffHour,
        idDispEnCabeza: this.state.idDispEnCabeza
      }
      var idSaladeVentaActual = localStorage.getItem("idSalaDeVentas");
      Meteor.call('salaDeVenta.update', idSaladeVentaActual, salaDeVenta, function(error, result) {
        Meteor.call('schedule.updateEncendidoYApagadoBySalaDeVentas', idSaladeVentaActual);
          if (error) {
              console.log(error); 
          }
          if (result) {
            console.log(result); 
          }
      });

      this.setState({
        name: '',
        cityArr: ['Bogotá', 'Cali', 'Medellín', 'Barranquilla', 'Cartagena', 'Soledad', 'Cúcuta','Soacha','Ibagué','Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Armenia', 'Villavicencio'],
        city: 'Bogotá',
        company: '',
        turnOnHour: '',
        turnOffHour:'',
        idDispEnCabeza: '',
      });

      this.dialog.show({
        title: 'Operación exitosa',
        body: "La sala de ventas fue editada en la base de datos",
        actions: [
          Dialog.OKAction(() => {
            window.location.assign("/salasVenta");
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          console.log('closed by clicking background.')
          window.location.assign("/salasVenta");
        }
      })
    }
    catch(err){
      window.alert("Algo salió mal..")
    }
      
  }

  renderCities(){
    let ops =[]
    this.state.cityArr.map((r,i)=>{
        
        ops.push(<option value={r} key ={i}>{r}</option>)
    });
    return ops;
 }


 renderForm(){
   if(this.props.salaDeVenta !== undefined){
  this.props.salaDeVenta.map((r,i)=>{
    this.setState({
      name: r.name,
      city: r.city,
      company: r.company,
      address: r.address,
      port: r.port,
      turnOnHour: r.turnOnHour,
      turnOffHour: r.turnOffHour,
      idDispEnCabeza: r.idDispEnCabeza
    })
   
    this.state.hasSettings = true;
      }  
     );  
  }
 }

 renderEmpresas(){
  let ops =[]
  
    this.props.empresas.map((r,i)=>{
      console.log(r.name);
        ops.push(<option value={r.name} key ={i}>{r.name}</option>)
    });
    return ops;
   }

 deleteDispositivoButton(){
   var idSalaDeVentas = localStorage.getItem('idSalaDeVentas');
   confirmAlert({
    title: 'Confirma para eliminar',
    message: '¿Estas seguro de que deseas eliminar la sala de venta? Se eliminaran también todos los dispositivos asociados a esta',
    buttons: [
      {
        label: 'SI',
        onClick: () => {
        Meteor.call('dispositivos.deleteBySalaDeVentas', idSalaDeVentas);
        Meteor.call('salaDeVenta.delete', idSalaDeVentas, function(error, result) {
          Meteor.call('schedule.updateEncendidoYApagadoBySalaDeVentas', idSalaDeVentas);
            if (error) {
                console.log(error); 
            }
            if (result) {
              console.log(result); 
            }
        });
        window.location.assign("/salasVenta");}
      },
      {
        label: 'NO',
        onClick: () => {}
      }
    ]
  });

  
}

 return(){
  window.location.assign("/salasVenta");
}
  render() {
    if(!this.state.hasSettings){
    return (
        <div className="container">
        <br/>
       <br/>
           <h1>Editar la sala de ventas</h1>
          {this.renderForm()}
            
           <div className="wrapper container">
           </div>                     
   </div>
    )}
    else if (this.state.hasSettings){
      return(
        <div className="container">
       <button className=' btn btn btn-danger' onClick={this.return}>Volver</button>
       <br/> <br/>
       <form onSubmit={this.handleSubmit}>
           <h1>Editar sala de ventas</h1>
           <div className="form-group">
               <label>Nombre</label>
               <input className="form-control" type="text" name ="name" id="name"  value={this.state.name} onChange={this.handleChange} required/>
           </div>
           <div className="form-group">
               <label>Ciudad</label>
               <select id="city" className="custom-select " name="city" value={this.state.city} onChange={this.handleChange} >
                   {this.renderCities()}
               </select>
               
           </div>
           <div className="form-group">
               <label>Cliente</label>
               <select id="company" className="custom-select " name="company"  value={this.state.company} onChange={this.handleChange} >
                   {this.renderEmpresas()}
               </select>
           </div>

           <div className="form-group"></div>
                 <label>Hora de encendido de equipos *</label>
                <input className="form-control" type="time" name="turnOnHour" id="turnOnHour" value={this.state.turnOnHour} onChange={this.handleChange}></input> 
         

            <div className="form-group">
                <label>Hora de apagado de equipos *</label>
                <input className="form-control" type="time" name="turnOffHour" id="turnOffHour" value={this.state.turnOffHour} onChange={this.handleChange}></input>  
            </div>
               <br/>
               <button type="submit" className="btn btn-success">Submit</button> 
               <Dialog ref={(component) => { this.dialog = component }} />
               <br/><br/>
          
       </form> 
       <div align="right">
               <button type="submit" className="btn btn btn-danger" onClick={this.deleteDispositivoButton.bind(this)}>Eliminar sala de Ventas</button> 
           </div>             
   </div>
      )
    }
  };


}

EditSaladeVentaForm.propTypes = {
    user: PropTypes.object,
    salaDeVenta: PropTypes.array.isRequired,
    empresas: PropTypes.array.isRequired
  };
  
  export default withTracker(() => {
     Meteor.subscribe('salaDeVentaById')
    return {
      empresas: Empresa.find({}).fetch(),
      salaDeVenta: SalaDeVenta.find(localStorage.getItem('idSalaDeVentas')).fetch(),
      user: Meteor.user()
    };
  }
  )(EditSaladeVentaForm);