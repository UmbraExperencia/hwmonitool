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
  refreshCPUTemperature(id,pDireccionMAC,conectado){
    if(conectado){
      Meteor.call('socket.refreshTemperatureOfMAC', pDireccionMAC);
    }
    else{
      this.dialog.show({
        title: 'No es posible completar la operación',
        body: "El cliente no esta conectado a la aplicación",
        actions: [
          Dialog.OKAction(() => {
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          
        }
      })
    }
  }

  infoCPUTemperature(id,pDireccionMAC,conectado, estadoEncendido){
    if(conectado){
      var info = estadoEncendido.replace(/[^\x00-\x7F]/g,"°")
      //var finalInfo = info.slice(0,10) + " " + info.slice(10)
      this.dialog.show({
        title: 'Detalles',
        body: <pre>  {info} </pre>,
        actions: [
          Dialog.OKAction(() => {
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          
        }
      })
    }
    else{
      this.dialog.show({
        title: 'No es posible completar la operación',
        body: "El cliente no esta conectado a la aplicación",
        actions: [
          Dialog.OKAction(() => {
          })
        ],
        bsSize: 'small',
        onHide: (dialog) => {
          dialog.hide()
          
        }
      })
    }
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

renderBotonEncendido(dispCabeza , idDispositivo, direccionMAC){
  if(dispCabeza){
    return <div>
         
        </div>
    }
    else{
      return <div> 
          <button className='btn btn-success'  align="center" onClick={this.encenderButton.bind(this,idDispositivo, direccionMAC)}>ENCENDER</button> &emsp;
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
          <button className='btn btn btn-circle  float-left' title="Detalles" onClick={this.infoCPUTemperature.bind(this,idDispositivo, direccionMAC, conectado, estadoEncendido)}>ⓘ</button>
            <div className='product-card-name'>
              
          {especificaciones}
          <hr></hr>
        </div>
        <button className='btn btn btn-circle  float-right' title="Refrescar temperatura" onClick={this.refreshCPUTemperature.bind(this,idDispositivo, direccionMAC, conectado)}>↻</button>
        
        <p className='text-center'>
        temperatura CPU: {temperaturaCPU} °C
        </p>
        <p className='text-center'>
        temperatura GPU: {temperaturaGPU} °C
        </p>
        <p className='text-center'>
        direccion MAC: {direccionMAC}
        </p>
        {this.renderBotonEncendido(dispCabeza, idDispositivo,direccionMAC)}
            <br/>
              <button className='btn btn btn-danger'  align="center" onClick={this.apagarButton.bind(this,idDispositivo, direccionMAC)}>APAGAR</button>
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
