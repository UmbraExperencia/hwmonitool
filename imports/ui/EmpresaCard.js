import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class EmpresaCard extends Component {

    constructor(props) {
        super(props);
    }

  editEmpresaButton(id){
        
    window.location.assign("/editEmpresa")
    localStorage.setItem('idEmpresa', id);
    
  }
  deleteEmpresaButton(id){
    confirmAlert({
      title: 'Confirma para eliminar',
      message: '¿Estas seguro de que deseas eliminar al cliente?',
      buttons: [
        {
          label: 'SI',
          onClick: () => {Meteor.call('empresas.delete', id);}
        },
        {
          label: 'NO',
          onClick: () => {}
        }
      ]
    });
    

  }
  
      render() {
        let {
          name,
          idEmpresa
        } = this.props;
        return (
          
          <div className='product-card3 text-center'>
          <div className='card-margin'>
          <button className='btn btn btn-circle float-right' title="Eliminar empresa" onClick={this.deleteEmpresaButton.bind(this,idEmpresa)}>X</button>
            <div className='product-card-name'>
          {name}
        </div>
              <button className='btn btn-editar' onClick={this.editEmpresaButton.bind(this,idEmpresa)}>EDITAR →</button>
            </div>
          </div>
        );
      }
}
