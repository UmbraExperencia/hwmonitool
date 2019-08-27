import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Dispositivo} from '../api/dispositivo.js'
import {SalaDeVenta} from '../api/salaDeVenta.js'
import Dialog from 'react-bootstrap-dialog';
class NewDispositivoForm extends Component {

  constructor(props){
    super(props);

    this.state={
        especificaciones: '',
        estadoEncendido: '',
        temperaturaCPU: '',
        temperaturaGPU: '',
        direccionMAC: '',
        dispCabeza: false,
        conectado: false,
        idSalaDeVentas: localStorage.getItem('idSalaDeVentas'),
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
      console.log(this.state.dispCabeza)
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
        idSalaDeVentas: this.state.idSalaDeVentas,  
      }
    /** 
      if(this.state.dispCabeza === true){
        console.log("why")
          Meteor.call('salaDeVenta.updateIdDispEnCabeza',this.state.idSalaDeVentas, this.state.direccionMAC)
      }*/
      console.log("tsk")
      Meteor.call('dispositivos.add', dispositivo, function(error, result) {
        Meteor.call('schedule.updateEncendidoYApagadoBySalaDeVentas', localStorage.getItem('idSalaDeVentas'));
          if (error) {
              console.log(error); 
          }
          if (result) {
            console.log(result); 
          }
      });

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
        title: 'Registro exitoso',
        body: "El dispositivo fue agregado a la base de datos",
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
      console.log(err)
    }
      
  }

return(){
  window.location.assign("/salaDeVentasDetails");
}
  render() {
    return (
        <div className="container">
          <button className=' btn btn btn-danger' onClick={this.return}>Volver</button>
        <br/>
       <br/>
       <form onSubmit={this.handleSubmit}>
           <h1>Registrar nuevo dispositivo</h1>
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
           <input className="form-check-input" type="checkbox"  id="dispCabeza" name = "dispCabeza"  onChange={this.handleChange}/>
                <label className="form-check-label" >Dispositivo en cabeza</label>
            </div>


               <button type="submit" className="btn btn-success">Submit</button> 
               <Dialog ref={(component) => { this.dialog = component }} />
             
       </form> 
                     
   </div>
    )
  };
}
NewDispositivoForm.propTypes = {
    user: PropTypes.object,
    salaDeVenta: PropTypes.array.isRequired,
  };
  
  export default withTracker(() => {
    Meteor.subscribe('salaDeVentaById')
    return {
      user: Meteor.user(),
      salaDeVenta: SalaDeVenta.find(localStorage.getItem('idSalaDeVentas')).fetch(),
    };
  })(NewDispositivoForm);