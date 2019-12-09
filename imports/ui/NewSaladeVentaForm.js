import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {SalaDeVenta} from '../api/salaDeVenta.js';
import {Empresa} from '../api/empresa.js';
import Dialog from 'react-bootstrap-dialog';
class NewSaladeVentaForm extends Component {

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
        hasEmpresas: false,
        TemperaturaSalaDeVenta:''
    };

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
        idDispEnCabeza: this.state.idDispEnCabeza,
        TemperaturaSalaDeVenta: this.state.TemperaturaSalaDeVenta
      }
    
      Meteor.call('salaDeVenta.add', salaDeVenta);

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
        title: 'Registro exitoso',
        body: 'La sala de ventas fue agregada a la base de datos',
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
prepareEmpresas(){
  if(this.props.empresas !== undefined){
    this.props.empresas.map((r,i)=>{
      this.setState({
        company: r.name,
      })
     
      this.state.hasEmpresas = true;
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

return(){
  window.location.assign("/salasVenta");
}
  render() {
    if(!this.state.hasEmpresas){
      return(
      <div className="container">
      <h1>Registrar nueva sala de ventas</h1>
     <select id="city" className="custom-select " name="city" onChange={this.handleChange} >
                   {this.prepareEmpresas()}
     </select>
     <h3>Es necesario haber registrado al menos un cliente</h3>
     </div>)
    }
    else if(this.state.hasEmpresas){
    return (
        <div className="container">
          <button className=' btn' onClick={this.return}>← VOLVER</button>
        <br/>
       <br/>
       <form onSubmit={this.handleSubmit}>
           <h1 align="center">REGISTRAR NUEVA SALA DE VENTAS</h1>
           <div className="form-group">
               <label>Nombre</label>
               <input className="form-control" type="text" name ="name" id="name"  value={this.state.name} onChange={this.handleChange} required/>
           </div>
           <div className="form-group">
               <label>Ciudad</label>
               <select id="city" className="custom-select " name="city" onChange={this.handleChange} >
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
                <input className="form-control" type="time" name="turnOffHour" id="turnOffHour" value={this.state.turnOffHour} onChange={this.handleChange} ></input>  
            </div>
            
           <div className="wrapper container">
           <div className="buttonRight">
               <button type="submit" className="btn">SUBMIT →</button> 
               </div>
               <div align="center">
               <img src="https://i.imgur.com/fNgxwl9.jpg"/>
               </div>
               <Dialog ref={(component) => { this.dialog = component }} />
           </div>     
       </form> 
                     
   </div>
    )}
  };
}
NewSaladeVentaForm.propTypes = {
    user: PropTypes.object,
    empresas: PropTypes.array.isRequired
  };
  
  export default withTracker(() => {
    Meteor.subscribe('empresas');
    return {
      empresas: Empresa.find({}).fetch(),
      user: Meteor.user()
    };
  })(NewSaladeVentaForm);