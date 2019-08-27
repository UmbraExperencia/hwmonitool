import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Empresa} from '../api/empresa.js'
import Dialog from 'react-bootstrap-dialog';
class EditEmpresaForm extends Component {

  constructor(props){
    super(props);

    this.state={
        name: '',
        hasSettings: false
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
      let empresa ={
        name: this.state.name,
      }
      var idEmpresaActual = localStorage.getItem("idEmpresa");
      Meteor.call('empresas.update', idEmpresaActual, empresa);

      this.setState({
        name: ''
      });

      this.dialog.show({
        title: 'Operación exitosa',
        body: "El cliente fue editado en la base de datos",
        actions: [
          Dialog.OKAction(() => {
            window.location.assign("/empresas");
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          console.log('closed by clicking background.')
          window.location.assign("/empresas");
        }
      })
    }
    catch(err){
      window.alert("Algo salió mal..")
    }
      
  }

return(){
  window.location.assign("/empresas");
}

renderForm(){
    if(this.props.empresa !== undefined){
   this.props.empresa.map((r,i)=>{
     this.setState({
       name: r.name,
     })
    
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
               <h1>Editar empresa</h1>
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
           <h1>Editar empresa</h1>
           <div className="form-group">
               <label>Nombre</label>
               <input className="form-control" type="text" name ="name" id="name"  value={this.state.name} onChange={this.handleChange} required/>
           </div>
        
           
          
               <button type="submit" className="btn btn-success">Submit</button> 
               <Dialog ref={(component) => { this.dialog = component }} />
             
       </form> 
                     
   </div>
    )
  };}
}
EditEmpresaForm.propTypes = {
    user: PropTypes.object,
    empresa: PropTypes.array.isRequired
  };
  
  export default withTracker(() => {
    Meteor.subscribe('empresasById')
    return {
      empresa: Empresa.find(localStorage.getItem('idEmpresa')).fetch(),
      user: Meteor.user()
    };
  })(EditEmpresaForm);