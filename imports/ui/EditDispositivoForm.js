import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Dispositivo} from '../api/dispositivo.js'
import Dialog from 'react-bootstrap-dialog';
class EditDispositivoForm extends Component {

  constructor(props){
    super(props);

    this.state={
        especificaciones: '',
        estadoEncendido: '',
        temperaturaCPU: '',
        temperaturaGPU: '',
        direccionMAC: '',
        dispCabeza: false,
        idSalaDeVentas: localStorage.getItem('idSalaDeVentas'),
        conectado: false,
        hasSettings: false
    };
    //bind
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.return= this.return.bind(this);
  }

    // EventHandlers

    handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
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
      let dispositivo ={
        especificaciones: this.state.especificaciones,
        estadoEncendido:this.state.estadoEncendido,
        temperaturaCPU: this.state.temperaturaCPU,
        temperaturaGPU: this.state.temperaturaGPU,
        direccionMAC: this.state.direccionMAC,
        dispCabeza: this.state.dispCabeza,
        conectado: this.state.conectado,
        idSalaDeVentas: this.state.idSalaDeVentas
      }
      var idDispositivoActual = localStorage.getItem("idDispositivo");
      Meteor.call('dispositivos.update', idDispositivoActual, dispositivo, function(error, result) {
        Meteor.call('schedule.updateEncendidoYApagadoBySalaDeVentas', localStorage.getItem('idSalaDeVentas'));
          if (error) {
              console.log(error); 
          }
          if (result) {
            console.log(result); 
          }
      });
      /**  
      if(this.state.dispCabeza === true){
          Meteor.call('salaDeVenta.updateIdDispEnCabeza',this.state.idSalaDeVentas, this.state.direccionMAC)
      }
      else if(this.state.OGCabeza){
        Meteor.call('salaDeVenta.updateIdDispEnCabeza',this.state.idSalaDeVentas, "")
      }*/
      this.setState({
        especificaciones: '',
        estadoEncendido: '',
        temperaturaCPU: '',
        temperaturaGPU: '',
        direccionMAC: '',
        idSalaDeVentas: '',
        dispCabeza: false,
        conectado: false,
      });

      this.dialog.show({
        title: 'Operación exitosa',
        body: "El dispositivo fue editado en la base de datos",
        actions: [
          Dialog.OKAction(() => {
            window.location.assign("/salaDeVentasDetails");
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          console.log('closed by clicking background.')
          window.location.assign("/salaDeVentasDetails");
        }
      })

    }
    catch(err){
      window.alert("Algo salió mal..")
    }
      
  }


return(){
  window.location.assign("/salaDeVentasDetails");
}

renderForm(){
    if(this.props.dispositivo !== undefined){
   this.props.dispositivo.map((r,i)=>{
     console.log(r.dispCabeza)
     console.log(r.especificaciones)
     this.setState({
       especificaciones: r.especificaciones,
       direccionMAC: r.direccionMAC,
       dispCabeza: r.dispCabeza,
       conectado: r.conectado
     })
     console.log(this.state.especificaciones)
     console.log(this.state.dispCabeza)
     this.state.hasSettings = true;
       }  
      );  
   }
  }

  render() {
    if(!this.state.hasSettings){
        return (
            <div className="container">
            <br/>
           <br/>
               <h1>Editar dispositivo</h1>
              {this.renderForm()}
                
               <div className="wrapper container">
               </div>                     
       </div>
        )}
    else if (this.state.hasSettings){
    return (
        <div className="container">
          <button className=' btn btn btn-danger' onClick={this.return}>Volver</button>
        <br/>
       <br/>
       <form onSubmit={this.handleSubmit}>
           <h1>Editar dispositivo</h1>
           <div className="form-group">
               <label>Especificaciones</label>
               <input className="form-control" type="text" name ="especificaciones" id="especificaciones"  value={this.state.especificaciones} onChange={this.handleChange} required/>
           </div>
        
           <div className="form-group">
               <label>Dirección MAC</label>
               <input className="form-control" type="text" name ="direccionMAC" id="direccionMAC" value={this.state.direccionMAC} onChange={this.handleChange} required/>
           </div>
           <br/>
           <div className="form-check text-center">
           <input className="form-check-input" type="checkbox"  id="dispCabeza" name = "dispCabeza"  value={this.state.dispCabeza} onChange={this.handleChange} checked={this.state.dispCabeza}/>
                <label className="form-check-label" >Dispositivo en cabeza</label>
            </div>
          
               <button type="submit" className="btn btn-success">Submit</button> 
               <Dialog ref={(component) => { this.dialog = component }} />
             
       </form> 
                     
   </div>
    )
  };}
}
EditDispositivoForm.propTypes = {
    user: PropTypes.object,
    dispositivo: PropTypes.array.isRequired
  };
  
  export default withTracker(() => {
    Meteor.subscribe('dispositivosById')
    return {
      dispositivo: Dispositivo.find(localStorage.getItem('idDispositivo')).fetch(),
      user: Meteor.user()
    };
  })(EditDispositivoForm);