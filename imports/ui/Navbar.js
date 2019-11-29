import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import {withTracker} from 'meteor/react-meteor-data';

import AccountsUIWrapper from './AccountsUIWrapper.js';

class Navbar extends Component {
 
  render() {
    if(this.props.user){
        return(
          <nav className="navbar navbar-expand-lg fixed-top navbar-light">
              <a className="navbar-brand" href="/">
              <img src="https://i.imgur.com/Nphggtz.jpg"  className="app-title"/>
              
              </a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <div className="navbar-nav">
                  
                    <a className="nav-item nav-link" href="/salasVenta">Salas de venta</a>
                    <a className="nav-item nav-link" href="/newSalaVenta">Registrar sala de ventas</a>
                    <a className="nav-item nav-link" href="/empresas">Clientes</a>
                    <a className="nav-item nav-link" href="/newEmpresa">Registrar cliente</a>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <AccountsUIWrapper/> 
              </div>
              </div>
            </nav> 
        )    
    }
    else{
      return(
          <nav className="navbar navbar-expand-lg fixed-top navbar-light" >
            <a className="navbar-brand" href="/">
               <strong className="app-title">HWMoniTool</strong>
             </a>
             <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                 <span className="navbar-toggler-icon"></span>
             </button>
             <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                 <div className="navbar-nav">
                 
                   &emsp;&emsp;&emsp;&emsp;
                   <AccountsUIWrapper/> 
             </div>
             </div>
           </nav> 
      )    
  }
}
}
Navbar.propTypes = {
  user: PropTypes.object
};

export default withTracker(() => {  
  return {
    user: Meteor.user()
  };
})(Navbar);