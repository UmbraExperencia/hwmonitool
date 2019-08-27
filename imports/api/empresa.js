import {Mongo} from 'meteor/mongo';

export const Empresa = new Mongo.Collection('empresas');

if (Meteor.isServer) {
    Meteor.publish('empresas', () => {
      return Empresa.find({});
    });

    Meteor.publish('empresasByID', function (pId) {
        return Empresa.find();
    })  
}

Meteor.methods({
    'empresas.add':function(pEmpresa){
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
          }
        Empresa.insert(pEmpresa);
    },
    'empresas.update':function(idEmpresa,pEmpresa){
        Empresa.update({ _id: idEmpresa },{
            $set: {
                name: pEmpresa.name
                }
        });
    },
    'empresas.delete':function(idEmpresa){
        return Empresa.remove({_id: idEmpresa});
    }
});