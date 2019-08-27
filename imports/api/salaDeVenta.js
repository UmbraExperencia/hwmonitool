import {Mongo} from 'meteor/mongo';

export const SalaDeVenta = new Mongo.Collection('salasDeVenta');

if (Meteor.isServer) {
    Meteor.publish('salasDeVenta', () => {
      return SalaDeVenta.find({});
    });

    Meteor.publish('salaDeVentaByID', function (pId) {
        return SalaDeVenta.find();
    })  

    Meteor.publish('salaDeVentaByEmpresa', function (pEmpresaName) {
        return SalaDeVenta.find({company: pEmpresaName});
    })  
}

Meteor.methods({
    'salaDeVenta.add':function(pSalaDeVenta){
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
          }
        SalaDeVenta.insert(pSalaDeVenta);
    },
    'salaDeVenta.update':function(idSaladeVenta,pSalaDeVenta){
        SalaDeVenta.update({ _id: idSaladeVenta },{
            $set: {
                name: pSalaDeVenta.name,
                city: pSalaDeVenta.city,
                company: pSalaDeVenta.company,
                address: pSalaDeVenta.address,
                port: pSalaDeVenta.port,
                turnOnHour: pSalaDeVenta.turnOnHour,
                turnOffHour: pSalaDeVenta.turnOffHour
                }
        });
    },

    'salaDeVenta.updateIdDispEnCabeza':function(idSaladeVenta,pIdDispEnCabeza){
        SalaDeVenta.update({ _id: idSaladeVenta },{
            $set: {
                idDispEnCabeza: pIdDispEnCabeza
                }
        });
    },
        
        'salaDeVenta.delete':function(idSaladeVentaToRemove){
            return SalaDeVenta.remove({_id: idSaladeVentaToRemove});
        }  
       
    }
);