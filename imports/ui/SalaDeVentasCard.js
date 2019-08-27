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
        </div>
            <p className='text-center'>
         Ciudad: {city}
         
        </p>
        <p className='text-center'>
        Cliente: {company}
        </p>
              <button className=' btn buy-button' onClick={this.detailsSaladeEventoButton.bind(this,idSaladeVentas, name,turnOnHour,turnOffHour)}>Ver estado</button>
              <button className=' btn buy-button' onClick={this.editSaladeEventoButton.bind(this,idSaladeVentas)}>Editar Información</button>
            </div>
          </div>
        );
      }
}
