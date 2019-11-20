import { Meteor } from 'meteor/meteor';

import "../imports/api/salaDeVenta.js"
import "../imports/api/dispositivo.js"
import "../imports/api/empresa.js"

import {SalaDeVenta} from "../imports/api/salaDeVenta.js";
import { Dispositivo } from "../imports/api/dispositivo.js";

const PORT =  8888;
/*
const PORT = parseInt(process.env.SOCKET_PORT) || 3003;
// Client-side config
WebAppInternals.addStaticJs(`
  window.socketPort = ${PORT};
`);*/


Meteor.startup(() => {
// @ts-nocheck
var Collections = require('typescript-collections');
var dictScheduling =  new Collections.MultiDictionary(); //HAY QUE GUARDAR LOS J ACA
var dict =  new Collections.Dictionary();

var socketVar = null
var app = require('http').createServer(handler)
var io = require('socket.io').listen(app);
var fs = require('fs');
var portToListen = 8080
/*
var server = app.listen({
  host: '0.0.0.0',
  port: 8080,
}, function(data) {
  console.log('------CALLBACKS DATA: ' , data)
  var host = server.address().address;
  var portp = server.address().port;
  console.log('Example app listening at http://%s:%s', host, portp);
});*/
//let port = process.env.PORT || 8888ss
//var server = app.listen(port);
 try {
  app.listen(PORT);
} catch (e) {
  console.error(e);
}
//SCHEDULING <------------------------
var schedule = require('node-schedule');

var salasDeVenta = SalaDeVenta.find({}).fetch()
//console.log(salasDeVenta)
salasDeVenta.map((salaDeVenta,salaDeVentai)=>{
 //console.log(salaDeVenta.name)
 //para el schedule de despertar
 var dispositivoEnCabeza = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id, dispCabeza: true}).fetch()
    dispositivoEnCabeza.map((dispEnCabeza,dispEnCabezai)=>{
        //console.log(dispEnCabeza.especificaciones + dispEnCabeza.direccionMAC)
        var res = salaDeVenta.turnOnHour.split(":") // PUEDE QUE FALLE AL NO HABER HECHO TRIM DEL 0
        var dispositivosPorSalaDeVenta = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id}).fetch()
       // console.log(dispositivosPorSalaDeVenta);
        var j1 = schedule.scheduleJob({hour: res[0], minute: res[1]}, function(){
         // console.log("HASTA")
           //EXCUTE WAKE ON LAN PROTOCOL
           var dispositivosALevantar = dispositivosPorSalaDeVenta
           //console.log("DONDE")
           dispositivosPorSalaDeVenta.map((dispActual,dispActuali)=>{
            //console.log(dispEnCabeza.especificaciones + dispEnCabeza.direccionMAC)
              dict.getValue(dispEnCabeza.direccionMAC).emit('wakePCByMAC',dispActual.direccionMAC) 
           });

          });
        j1.disp = dispEnCabeza.especificaciones;
        dictScheduling.setValue(salaDeVenta._id,j1)
        console.log("wakeonlan scheduled for device with MAC ADDRESS " + dispEnCabeza.direccionMAC + " at "+salaDeVenta.turnOnHour);
      
    });
//para el schedule de apagar
var dispositivosPorSalaDeVenta = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id}).fetch()
dispositivosPorSalaDeVenta.map((dispActual,dispActuali)=>{
  var res = salaDeVenta.turnOffHour.split(":") // PUEDE QUE FALLE AL NO HABER HECHO TRIM DEL 0
  var j2 = schedule.scheduleJob({hour: res[0], minute: res[1]}, function(){
     //EXCUTE SLEEP PROTOCOL
     dict.getValue(dispActual.direccionMAC).emit('sleepPCByMAC')
    });
  j2.disp = dispActual.especificaciones;
  dictScheduling.setValue(salaDeVenta._id,j2)
  console.log("sleep scheduled for device with MAC ADDRESS " + dispActual.direccionMAC + " at "+salaDeVenta.turnOffHour);

});

});


//-------------TEST-------------------

//No puedee ser 00 el tiempo, tiene que ser 0
//Cuando se corre el servidor por primera vez, la libreria usa la hora del sistema en ESE momento, por lo que cambiar la hora del sistema luego de haber iniciado el servidor no tiene ningun efecto
var j = schedule.scheduleJob({hour: 10, minute: 02}, function(){
  console.log("THIS IS IT");
  });

//-------------------------------------


  //SOCKETS XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection',Meteor.bindEnvironment((socket)=> {
  var maciD;
  console.log("connection attempt...")
  socketVar = socket;
  socketVar.emit('IdentifySocket')
  socketVar.on('MACIdentification',  Meteor.bindEnvironment((MACIdentification) =>{
    console.log('The client with MAC address ' + MACIdentification + ' has joined the server' );
    dict.setValue(MACIdentification,socketVar);
    dict.getValue(MACIdentification).emit('SocketValidationTest')
    Meteor.call('dispositivos.updateConnection',MACIdentification,true)
    maciD = MACIdentification
  }));
  socketVar.on('disconnect', Meteor.bindEnvironment(function() {
    console.log('The client with MAC address ' + maciD + ' has disconnected')
    Meteor.call('dispositivos.updateConnection',maciD,false)

  }));  
}));


  //METHODS
  Meteor.methods({

    foo: function () {
        return 1;
    },

    bar: function () {
    // QUESTION: HOW TO CALL Meteor.methods.foo

        return 1 + foo;

    },

    'socket.sendWakeMessageToMAC':function(pconMac){
   
      var res = pconMac.split("-")
      console.log("DIR MAC CABEZA "+ res[0])
      console.log("DIR MAC TO "+ res[1])
      dict.getValue(res[0]).emit('wakePCByMAC',res[1])
      //socketVar.emit('wakePCByMAC', DirecconMAC);
  },

  'socket.sendSleepMessageToMAC':function(DirecconMAC){
    dict.getValue(DirecconMAC).emit('sleepPCByMAC')
    //socketVar.emit('sleepPCByMAC', DirecconMAC);
},

'schedule.updateEncendidoYApagadoBySalaDeVentas':function(idSalaDeVentas){
  console.log("-------RESCHEDULING-----------------");
  dictScheduling.getValue(idSalaDeVentas).forEach(cancelSchedules);
  function cancelSchedules(item, index) {
    console.log(item.disp + "cancelled")
    item.cancel();
  }
  dictScheduling.remove(idSalaDeVentas)
  var salasDeVenta = SalaDeVenta.find({_id: idSalaDeVentas}).fetch()
  salasDeVenta.map((salaDeVenta,salaDeVentai)=>{
   //para el schedule de despertar
   var dispositivoEnCabeza = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id, dispCabeza: true}).fetch()
      dispositivoEnCabeza.map((dispEnCabeza,dispEnCabezai)=>{
          var res = salaDeVenta.turnOnHour.split(":") // PUEDE QUE FALLE AL NO HABER HECHO TRIM DEL 0
          var dispositivosPorSalaDeVenta = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id}).fetch()
          var j1 = schedule.scheduleJob({hour: res[0], minute: res[1]}, function(){
             //EXCUTE WAKE ON LAN PROTOCOL
             var dispositivosALevantar = dispositivosPorSalaDeVenta
             dispositivosPorSalaDeVenta.map((dispActual,dispActuali)=>{
                dict.getValue(dispEnCabeza.direccionMAC).emit('wakePCByMAC',dispActual.direccionMAC) 
             });
  
            });
            j1.disp = dispEnCabeza.especificaciones;
          dictScheduling.setValue(salaDeVenta._id,j1)
          console.log("wakeonlan scheduled for device with MAC ADDRESS " + dispEnCabeza.direccionMAC + " at "+salaDeVenta.turnOnHour);
        
      });
  //para el schedule de apagar
  var dispositivosPorSalaDeVenta = Dispositivo.find({ idSalaDeVentas: salaDeVenta._id}).fetch()
  dispositivosPorSalaDeVenta.map((dispActual,dispActuali)=>{
    var res = salaDeVenta.turnOffHour.split(":") // PUEDE QUE FALLE AL NO HABER HECHO TRIM DEL 0
    var j2 = schedule.scheduleJob({hour: res[0], minute: res[1]}, function(){
       //EXCUTE SLEEP PROTOCOL
       dict.getValue(dispActual.direccionMAC).emit('sleepPCByMAC')
      });
      j2.disp = dispActual.especificaciones;
    dictScheduling.setValue(salaDeVenta._id,j2)
    console.log("sleep scheduled for device with MAC ADDRESS " + dispActual.direccionMAC + " at "+salaDeVenta.turnOffHour);
  
  });
  
  });

  console.log("-------ReschedulingOVER-----------------");
},
  
 });

});