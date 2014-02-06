// Creation du serveur
var server = require('http').createServer(function(req, res){
		res.end('chargement effectué');
	});

// Variables globales
// liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];
var pseudos = [];

var io = require('socket.io').listen(server);

io.set('log level', 1);
io.sockets.on('connection', function (socket) {

        // Quand on recoit un nouveau message
        socket.on('setNouveauMessage', function (mess) { //message de la forme {'pseudo' : pseudo, 'message' : message }
			messages.push(mess);
			console.log('Nouveau message de '+mess.pseudo+' : '+mess.message);
			socket.broadcast.emit('Message', mess);
        });
		
		
		//Quand quelqu'un se connecte
		socket.on('firstConnect', function (pseudo) {
			console.log(pseudo+" vient de se connecter.");
			socket.emit('Messages', messages);
			socket.emit('Pseudos', pseudos);
			socket.broadcast.emit('nouveauClient', pseudo); // On envoie a tout les clients connectes le nouveau pseudo
			pseudos.push(pseudo);
        });
		
		//Quand quelqu'un se déconnecte
		socket.on("deconnection", function (pseudo) {
			console.log(pseudo+" vient de se déconnecter.");
			socket.broadcast.emit("retirerPseudoDeco", pseudo);
			pseudos.removeElement(pseudo);
		});
		
		
		socket.on("testServeur", function(){
			console.log("test reçu");
		});
			
});



// Notre application ecoute sur le port 8080
server.listen(8080);
console.log('Live Chat App running at http://192.168.0.13:8080/');



pseudos.removeElement = function(elementToBeDlt){
	i = pseudos.indexOf(elementToBeDlt);
	pseudos.splice(i,1);
}