import React, { Component } from 'react';
import SalaDeVentasCard  from './SalaDeVentasCard.js';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import InfiniteScroll from 'react-infinite-scroller';
import {Empresa} from '../api/empresa.js';


import {SalaDeVenta} from '../api/salaDeVenta.js';

class ViewSalasdeVenta extends Component {

    constructor(props){
        super(props);
    
        this.state={
            currentPage: 1,
            salasPerPage: 9,
            currentSalasDeVenta:[],
            salasDeVenta:[],
            empresaFilter:'Todos'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.setState({
          currentPage: Number(event.target.id)
        });
    }

    handleChange(event) {
        this.state.currentPage = 1;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    componentDidMount(){
        
    }
    renderSalasdeVenta(currentSalasDeVenta){
        let salasDeVenta =[]
        
        currentSalasDeVenta.map((r,i)=>{
        
                salasDeVenta.push(
                    <div className="col-sm">
                    <SalaDeVentasCard
                    key={i}
                    name={ r.name}
                    city =  {r.city}
                    company = {r.company}
                    turnOnHour = {r.turnOnHour}
                    turnOffHour = {r.turnOffHour}
                    idSaladeVentas={r._id}
                    />
                    </div>
                ); 
  
                });
        return salasDeVenta;
    };

    paginate(salasDeVentaArray){
        const currentPage = this.state.currentPage;
        let currentminus = currentPage-15;
        let currentplus = currentPage+15;
        const salasPerPage = this.state.salasPerPage;

        const indexLast = currentPage * salasPerPage;
        const indexFirst = indexLast-salasPerPage;
        const current = salasDeVentaArray.slice(indexFirst,indexLast);
        let pageNumbers = [];

        for (let i = 1; i <= Math.ceil(salasDeVentaArray.length / salasPerPage); i++) {
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
        
        if(this.state.empresaFilter == 'Todos'){
            return this.paginate(this.props.salasDeVenta);
        }
        else{
            return this.paginate(SalaDeVenta.find({company: this.state.empresaFilter}).fetch())
        } 
     


    }

    renderselect(){
        const currentPage = this.state.currentPage;
        const salasPerPage = this.state.salasPerPage;

        const indexLast = currentPage * salasPerPage;
        const indexFirst = indexLast-salasPerPage;
        let current = [];
     
        if(this.state.empresaFilter == 'Todos'){
            current = this.props.salasDeVenta.slice(indexFirst,indexLast);
        }
        else{
            current = SalaDeVenta.find({company: this.state.empresaFilter}).fetch().slice(indexFirst,indexLast);
        }
        
        if(current.length == 0){
            return  <div className="col-sm">
             <h1 className= 'text-center h1NoHayDispositivos'>Registra nuevas salas de venta</h1> 
            </div>
          }
          else{
            return this.renderSalasdeVenta(current);
          }

    }

    renderEmpresas(){
        let ops =[]
        ops.push(<option value={"Todos"} key ={"T"}>{"Todos"}</option>)
          this.props.empresas.map((r,i)=>{
              ops.push(<option value={r.name} key ={i}>{r.name}</option>)
          });
          return ops;
         }
      


  render() {
    return (
       
    <div className="container">
                <h1 className= 'text-center'>SALAS DE VENTA</h1> 
                <div className="form-check">
                <h3>Filtrar por cliente</h3>
                <select id="empresaFilter" className="custom-select " name="empresaFilter"  value={this.state.empresaFilter} onChange={this.handleChange} >
                   {this.renderEmpresas()}
               </select>
            </div>
            <hr></hr> 
        <div className="row" align="center">
        {this.renderselect()}

        </div>
        <hr></hr> 
        <div className="row text-center">
        <ul id="page-numbers">
              {
                  this.arrayselect()
              }
         </ul> 
          </div>
          <div align="center">
               <img src="https://i.imgur.com/fNgxwl9.jpg"/>
               </div>
    </div>
      
    )
  }
}

ViewSalasdeVenta.propTypes ={
    salasDeVenta: PropTypes.array.isRequired,
    user: PropTypes.object,  
    empresas: PropTypes.array.isRequired
}

export default withTracker(()=>{
    Meteor.subscribe('salasDeVenta');
    return{
        empresas: Empresa.find({}).fetch(),
        salasDeVenta: SalaDeVenta.find({}).fetch(),
        user: Meteor.user()
    };
})(ViewSalasdeVenta);