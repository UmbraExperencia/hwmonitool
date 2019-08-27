import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Empresa} from '../api/empresa.js';
import Dialog from 'react-bootstrap-dialog';
class NewEmpresaForm extends Component {

  constructor(props){
    super(props);

    this.state={
        name: '',
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
        name: this.state.name
      }
    
      Meteor.call('empresas.add', empresa);

      this.setState({
        name: '',
      });

      this.dialog.show({
        title: 'Registro exitoso',
        body: "El cliente fue agregado a la base de datos",
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
  render() {
    return (
        <div className="container">
          <button className=' btn btn btn-danger' onClick={this.return}>Volver</button>
        <br/>
       <br/>
       <form onSubmit={this.handleSubmit}>
           <h1>Registrar nuevo cliente</h1>
           <div className="form-group">
               <label>Nombre</label>
               <input className="form-control" type="text" name ="name" id="name"  value={this.state.name} onChange={this.handleChange} required/>
           </div>
               <button type="submit" className="btn btn-success">Submit</button> 
               <Dialog ref={(component) => { this.dialog = component }} />
             
       </form> 
                     
   </div>
    )
  };
}
NewEmpresaForm.propTypes = {
    user: PropTypes.object
  };
  
  export default withTracker(() => {
     
    return {
      user: Meteor.user()
    };
  })(NewEmpresaForm);