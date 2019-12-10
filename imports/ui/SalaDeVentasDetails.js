import React, { Component } from 'react';
import DispositivoCard  from './DispositivoCard.js';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import InfiniteScroll from 'react-infinite-scroller';
import "../api/salaDeVenta.js"
import {SalaDeVenta} from '../api/salaDeVenta.js';
import { Dispositivo } from '../api/dispositivo.js';

class SalaDeVentasDetails extends Component {

    constructor(props){
        super(props);
    
        this.state={
            currentPage: 1,
            dispositivosPerPage: 9,
            currentDispositivos:[],
            dispositivos:[]
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateTemperaturaSalaDeVenta = this.updateTemperaturaSalaDeVenta.bind(this)
    }

    updateTemperaturaSalaDeVenta(){
      console.log("updating temperature . . .")
      var salaDeVenta = SalaDeVenta.find({_id: localStorage.getItem("idSalaDeVentas")}).fetch();
      salaDeVenta.map((salaVenta,salaVentai)=>{
        var temperatura = salaVenta.TemperaturaSalaDeVenta;
        var city = salaVenta.city;
        console.log(city + temperatura);
        document.getElementById('idTemperaturaSalaVenta').innerText = city +  ": " + temperatura+ " °C"
      })
    }

    newDispositivoButton(id){
        
        window.location.assign("/NewDispositivo")
        localStorage.setItem('idSalaDeVentas', id);
      
    }
    editSaladeEventoButton(){
        window.location.assign("/editSalaVenta")
        localStorage.setItem('idSalaDeVentas', localStorage.getItem('idSalaDeVentas'));
    }
    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    
    componentDidMount(){
        
    }
    renderDispositivos(currentDispositivos){
        let dispositivos =[]
        
        currentDispositivos.map((r,i)=>{
        
               dispositivos.push(
                    <div className="col-sm">
                    <DispositivoCard
                    key={i}
                    especificaciones={ r.especificaciones}
                    estadoEncendido =  {r.estadoEncendido}
                    temperaturaCPU = {r.temperaturaCPU}
                    temperaturaGPU={r.temperaturaGPU}
                    direccionMAC={r.direccionMAC}
                    dispCabeza={r.dispCabeza}
                    conectado={r.conectado}
                    idDispositivo={r._id}
                    />
                    </div>
                ); 
  
                });

        if(this.props.dispCabeza.length ==1) {
          this.props.dispCabeza.map((r,i)=>{
            
            localStorage.setItem('MACAddressCabeza', r.direccionMAC);
        
            })  
        }      
        else if(this.props.dispCabeza.length==0){

          localStorage.setItem('MACAddressCabeza', '');
        }
        else{
          localStorage.setItem('MACAddressCabeza', 'ERR');
        }

        return dispositivos;
    };

    paginate(dispositivosArray){
        const currentPage = this.state.currentPage;
        let currentminus = currentPage-15;
        let currentplus = currentPage+15;
        const dispositivosPerPage = this.state.dispositivosPerPage;

        const indexLast = currentPage * dispositivosPerPage;
        const indexFirst = indexLast-dispositivosPerPage;
        const current = dispositivosArray.slice(indexFirst,indexLast);
        let pageNumbers = [];

        for (let i = 1; i <= Math.ceil(dispositivosArray.length / dispositivosPerPage); i++) {
            pageNumbers.push(i);
        }
        let pages =[];

        if(currentminus<0){
            currentplus = currentplus-currentminus;
            currentminus =0;
            
        }else if(currentplus>indexLast-1){
            currentplus=indexLast-1;
        } 
        
        pageNumbers = pageNumbers.slice(currentminus,currentplus);

        pageNumbers.map(number => {
            pages.push (
              <li
                key={number}
                id={number}
                onClick={this.handleClick}
              >
                {number}
              </li>
            );
          });
   
          

          return pages;
    }

    arrayselect(){
            return this.paginate(this.props.dispositivos);


    }

    renderselect(){
        const currentPage = this.state.currentPage;
        const dispositivosPerPage = this.state.dispositivosPerPage;

        const indexLast = currentPage * dispositivosPerPage;
        const indexFirst = indexLast-dispositivosPerPage;
        let current = [];

        current = this.props.dispositivos.slice(indexFirst,indexLast);
            
        console.dir(this.props.dispositivos)
        if(current.length == 0){
          console.log("nunca")
          return  <div className="col-sm">
           <h1 className= 'text-center h1NoHayDispositivos'>Registra nuevos dispositivos</h1> 
          </div>
        }
        else{
          return this.renderDispositivos(current);
        }

    }

    return(){
        window.location.assign("/salasVenta");
      }

  getTurnOnHour(){
      let turnOnHour = '';
      if(localStorage.getItem('turnOnHour')){
        turnOnHour = localStorage.getItem('turnOnHour')
      }
      else {
        turnOnHour = 'No se ha registrado una hora'
      }

      return turnOnHour;
  }

  getTurnOffHour(){
    let turnOffHour = '';
    if(localStorage.getItem('turnOffHour')){
      turnOffHour = localStorage.getItem('turnOffHour')
    }
    else {
      turnOffHour = 'No se ha registrado una hora'
    }

    return turnOffHour;
}

getTemperaturaSalaDeVenta(){
  let temperaturaSalaDeVenta = '';
  if(localStorage.getItem('TemperaturaSalaDeVenta')){
    temperaturaSalaDeVenta = localStorage.getItem('city') +  ": " + localStorage.getItem('TemperaturaSalaDeVenta')+ " °C"
  }
  else {
    temperaturaSalaDeVenta = 'No se ha actualizado la temperatura, haga click en el botón de actualizar o espere una hora y vuelvalo a intentar'
  }

  return temperaturaSalaDeVenta;
}

  render() {
    return (
       
    <div className="container">
            <button className='btn' onClick={this.return}>← VOLVER</button>
         <h1 className= 'text-center'>{localStorage.getItem('nameSalaDeVentas')}</h1> 
         <br/>
                <h2 className= 'text-left'>Dispositivos de la sala de ventas</h2> 
        <br/>
        <div className="row" align="center">
        {this.renderselect()}

        </div>
        <div className="row text-center">
        <ul id="page-numbers">
              {
                  this.arrayselect()
              }
         </ul> 
         
          </div>
          <hr></hr> 
          <h2 className= 'text-left'>Encendido y apagado automático de los dispositivos</h2> 
          <br/>
          <h3 className= 'text-left'>Hora de encendido </h3> <h4 className="h4Time">{this.getTurnOnHour()}</h4>
          <br/>
          <h3 className= 'text-left'>Hora de apagado </h3> <h4 className="h4Time">{this.getTurnOffHour()}</h4>
          <br/>
          <hr></hr> 
          <h2 className= 'text-left'>Temperatura de la sala de ventas</h2> 
          <button className='btn btn btn-circle  float-left' title="Refrescar temperatura" onClick={this.updateTemperaturaSalaDeVenta.bind()}>↻</button>
          <h3 className= 'text-left' id="idTemperaturaSalaVenta">{this.getTemperaturaSalaDeVenta()}</h3>
          <hr></hr> 
          <h5 className= 'text-left'>Nota: Debe existir UN dispositivo en cabeza 👑</h5> 
          <hr></hr> 
          <button className=' btn buy-button' onClick={this.editSaladeEventoButton.bind(this,localStorage.getItem('idSalaDeVentas'))}>Editar Información →</button> &emsp;&emsp;&emsp;
          <button className=' btn buy-button' onClick={this.newDispositivoButton.bind(this,localStorage.getItem('idSalaDeVentas'))}>Registrar Dispositivo →</button>
          <div align="center">
               <img src="https://i.imgur.com/fNgxwl9.jpg"/>
               </div>
    </div>
    
    )
  }
}

SalaDeVentasDetails.propTypes ={
    dispositivos: PropTypes.array.isRequired,
    dispCabeza: PropTypes.array.isRequired,
    user: PropTypes.object  
}

export default withTracker(()=>{
    Meteor.subscribe('dispositivosBySalaDeVenta');
    return{
        dispositivos: Dispositivo.find({idSalaDeVentas: localStorage.getItem('idSalaDeVentas')}).fetch(),
        dispCabeza:  Dispositivo.find({dispCabeza: true,idSalaDeVentas: localStorage.getItem('idSalaDeVentas') }).fetch(),
        user: Meteor.user()
    };
})(SalaDeVentasDetails);