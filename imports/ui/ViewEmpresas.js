import React, { Component } from 'react';
import EmpresaCard  from './EmpresaCard.js';
import {withTracker} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import InfiniteScroll from 'react-infinite-scroller';


import {Empresa} from '../api/empresa.js';

class ViewEmpresas extends Component {

    constructor(props){
        super(props);
    
        this.state={
            currentPage: 1,
            empresasPerPage: 9,
            currentEmpresas:[],
            empresas:[]
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
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    componentDidMount(){
        
    }
    renderEmpresas(currentEmpresas){
        let empresas =[]
        
        currentEmpresas.map((r,i)=>{
        
                empresas.push(
                    <div className="col-sm">
                    <EmpresaCard
                    key={i}
                    name={ r.name}
                    idEmpresa={r._id}
                    />
                    </div>
                ); 
  
                });
        return empresas;
    };

    paginate(empresasArray){
        console.log(empresasArray);
        const currentPage = this.state.currentPage;
        let currentminus = currentPage-15;
        let currentplus = currentPage+15;
        const empresasPerPage = this.state.empresasPerPage;

        const indexLast = currentPage * empresasPerPage;
        const indexFirst = indexLast-empresasPerPage;
        const current = empresasArray.slice(indexFirst,indexLast);
        let pageNumbers = [];

        for (let i = 1; i <= Math.ceil(empresasArray.length / empresasPerPage); i++) {
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
        
            return this.paginate(this.props.empresas);
     


    }

    renderselect(){
        const currentPage = this.state.currentPage;
        const empresasPerPage = this.state.empresasPerPage;

        const indexLast = currentPage * empresasPerPage;
        const indexFirst = indexLast-empresasPerPage;
        let current = [];
     
        console.log(this.props.empresas);
        current = this.props.empresas.slice(indexFirst,indexLast);
            
        console.dir(this.props.empresas)
        if(current.length == 0){
            return  <div className="col-sm">
             <h1 className= 'text-center h1NoHayDispositivos'>Registra nuevos clientes</h1> 
            </div>
          }
          else{
            return this.renderEmpresas(current);
          }

    }





  render() {
    return (
       
    <div className="container">
                <h1 className= 'text-center'>Clientes</h1> 
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
         
    </div>
      
    )
  }
}

ViewEmpresas.propTypes ={
    empresas: PropTypes.array.isRequired,
    user: PropTypes.object  
}

export default withTracker(()=>{
    Meteor.subscribe('empresas');
    return{
        empresas: Empresa.find({}).fetch(),
        user: Meteor.user()
    };
})(ViewEmpresas);
