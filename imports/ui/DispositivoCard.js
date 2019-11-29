import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Dialog from 'react-bootstrap-dialog';

export default class DispositivoCard extends Component {

    constructor(props) {
        super(props);
    }

    encenderButton(id,pDireccionMAC){       

      console.log("MACADDCAB: "+ localStorage.getItem('MACAddressCabeza'))
      if(localStorage.getItem('MACAddressCabeza') === 'ERR' ||localStorage.getItem('MACAddressCabeza') === '' ){
        console.log('yeah, that')
        this.dialog.show({
          title: 'Operación fallida',
          body: "Debe existir UN dispositivo en cabeza 👑",
          actions: [
            Dialog.OKAction(() => {
              
            })
          ],
          bsSize: 'small',
          onHide: (dialog) => {
            dialog.hide()
            console.log('closed by clicking background.')
           
          }
        })
      }
      else{
        console.log("MACADDTO: "+ pDireccionMAC)
        var concMAC = localStorage.getItem('MACAddressCabeza') + "-" +  pDireccionMAC
        Meteor.call('socket.sendWakeMessageToMAC', concMAC);
      }
    }
    apagarButton(id,pDireccionMAC){
        
      Meteor.call('socket.sendSleepMessageToMAC', pDireccionMAC);
    
  }
  editDispositivoButton(id){
        
    window.location.assign("/editDispositivo")
    localStorage.setItem('idDispositivo', id);
    
  }
  deleteDispositivoButton(id){
    confirmAlert({
      title: 'Confirma para eliminar',
      message: '¿Estas seguro de que deseas eliminar el dispositivo?',
      buttons: [
        {
          label: 'SI',
          onClick: () => {
            Meteor.call('dispositivos.delete', id, function(error, result) {
              Meteor.call('schedule.updateEncendidoYApagadoBySalaDeVentas', localStorage.getItem('idSalaDeVentas'));
                if (error) {
                    console.log(error); 
                }
                if (result) {
                  console.log(result); 
                }
            });
            //Meteor.call('salaDeVenta.updateIdDispEnCabeza',id, "")
          }   
        },
        {
          label: 'NO',
          onClick: () => {}
        }
      ]
    });
    

  }
  
  renderDispCabeza(dispCabeza){
      if(dispCabeza){
      return <div>
           <h3 className= 'float-left' title="Dispositivo en cabeza">👑</h3> 
          </div>
      }
      else{
        return <div> 
       </div>
      }
  }
  renderConectado(conectado){
    if(conectado){
    return <div>
         <h3 className= 'float-center' title="Dispositivo en cabeza">🔵</h3> 
        </div>
    }
    else{
      return <div>
      <h3 className= 'float-center' title="Dispositivo en cabeza">🔴</h3> 
     </div>
    }
}
      render() {
        let {
          especificaciones,
          estadoEncendido,
          temperaturaCPU,
          temperaturaGPU,
          direccionMAC,
          dispCabeza,
          conectado,
          idDispositivo
        } = this.props;
        return (
          
          <div className='product-card2 text-center'>
          <div className='card-margin'>
          {this.renderDispCabeza(dispCabeza)}
          <button className='btn btn btn-circle  float-right' title="Eliminar dispositivo" onClick={this.deleteDispositivoButton.bind(this,idDispositivo)}>X</button>
            <div className='product-card-name'>
              
          {especificaciones}
          <hr></hr>
        </div>
        <p className='text-center'>
        temperatura CPU: {temperaturaCPU}
        </p>
        <p className='text-center'>
        temperatura GPU: {temperaturaGPU}
        </p>
        <p className='text-center'>
        direccion MAC: {direccionMAC}
        </p>
              <button className='btn btn-success' onClick={this.encenderButton.bind(this,idDispositivo, direccionMAC)}>ENCENDER</button> &emsp;
              <button className='btn btn btn-danger' onClick={this.apagarButton.bind(this,idDispositivo, direccionMAC)}>APAGAR</button>
              <br/><br/>
              <button className='btn' onClick={this.editDispositivoButton.bind(this,idDispositivo)}>EDITAR →</button>
              <br/><br/>
              {this.renderConectado(conectado)}
              
              
            </div>
            <Dialog ref={(component) => { this.dialog = component }} />
          </div>
        );
      }
}
