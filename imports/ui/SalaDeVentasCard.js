import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';

export default class SalaDeVentasCard extends Component {

    constructor(props) {
        super(props);
    }

    detailsSaladeEventoButton(id,name, turnOnHour,turnOffHour){
        
        window.location.assign("/salaDeVentasDetails")
        localStorage.setItem('idSalaDeVentas', id);
        localStorage.setItem('nameSalaDeVentas', name);
        localStorage.setItem('turnOnHour',turnOnHour)
        localStorage.setItem('turnOffHour',turnOffHour)
    }
    editSaladeEventoButton(id){
        
      window.location.assign("/editSalaVenta")
      localStorage.setItem('idSalaDeVentas', id);
    
  }
      render() {
        let {
          name,
          city,
          company,
          turnOnHour,
          turnOffHour,
          idSaladeVentas
        } = this.props;
    
        return (
          
          <div className='product-card text-center'>
          <div className='card-margin'>
            <div className='product-card-name'>
          {name}
          <hr></hr> 
        </div>
            <p className='text-center'>
         Ciudad: {city}
         
        </p>
        <p className='text-center'>
        Cliente: {company}
        </p>
              <div className='buttonSalaDeVenta'>
              <button className=' btn' onClick={this.detailsSaladeEventoButton.bind(this,idSaladeVentas, name,turnOnHour,turnOffHour)}>VER ESTADO →</button>
              </div>
              <button className=' btn' onClick={this.editSaladeEventoButton.bind(this,idSaladeVentas)}>EDITAR INFORMACIÓN →</button>
            </div>
          </div>
        );
      }
}
