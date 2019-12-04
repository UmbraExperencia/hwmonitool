import {Mongo} from 'meteor/mongo';

export const Dispositivo = new Mongo.Collection('dispositivos');

if (Meteor.isServer) {
    Meteor.publish('dispositivos', () => {
      return Dispositivo.find({});
    });

    Meteor.publish('dispositivosByID', function (pId) {
        return Dispositivo.find();
    })  

    Meteor.publish('dispositivosBySalaDeVenta', (pIdDispositivo)=>{
        return Dispositivo.find({idDispositivo: pIdDispositivo});
    })

    Meteor.publish('dispositivoByCabeza', ()=>{
        return Dispositivo.find({dispCabeza: true});
    })
}

Meteor.methods({
    'dispositivos.add':function(pDispositivo){
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
          }
        Dispositivo.insert(pDispositivo);
    },
    'dispositivos.update':function(idDispositivo,pDispositivo){
        Dispositivo.update({ _id: idDispositivo },{
            $set: {
                especificaciones: pDispositivo.especificaciones,
                direccionMAC: pDispositivo.direccionMAC,
                dispCabeza: pDispositivo.dispCabeza,
                }
        });
    },
    'dispositivos.delete':function(idDispositivo){
        return Dispositivo.remove({_id: idDispositivo});
    },  
    'dispositivos.deleteBySalaDeVentas':function(pIdSalaDeVentas){
        return Dispositivo.remove({idSalaDeVentas: pIdSalaDeVentas});
    },
    'dispositivos.updateConnection':function(direccionMACDisp, connection ){
        Dispositivo.update({ direccionMAC: direccionMACDisp },{
            $set: {
                conectado: connection,
                }
        });
    },
    'dispositivos.updateTemperatureCPU':function(direccionMACDisp, temperature , details){
        Dispositivo.update({ direccionMAC: direccionMACDisp },{
            $set: {
                temperaturaCPU: temperature,
                estadoEncendido: details,
                }
        });
    },
    'dispositivos.updateTemperatureGPU':function(direccionMACDisp, temperature){
        Dispositivo.update({ direccionMAC: direccionMACDisp },{
            $set: {
                temperaturaGPU: temperature,
                }
        });
    }

});