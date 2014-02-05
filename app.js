// Creation du serveur
var server = require('http').createServer(function(req, res){
		res.end('chargement effectué');
	});

// Variables globales
// liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];
var pseudos = [];

var io = require('socket.io').listen(server); 

io.sockets.on('connection', function (socket) {


        // Quand on recoit un nouveau message
        socket.on('setNouveauMessage', function (mess) { //message de la forme {'pseudo' : pseudo, 'message' : message }
			messages.push(mess);
			console.log(mess);
			// On envoie a tout les clients connectes le nouveau message
			socket.broadcast.emit('Message', mess);
        });
		
		//Quand le serveur reçoit une demande d'actualisation des messages
		socket.on('getMessages', function () {
			socket.emit('Messages', messages);
			console.log("liste des messages"+messages);
        });
		
		
		//Quand quelqu'un se connecte
		socket.on('firstConnect', function (pseudo) {
			socket.emit('Messages', messages);
			socket.emit('Pseudos', pseudos);
			socket.broadcast.emit('nouveauClient', pseudo); // On envoie a tout les clients connectes le nouveau pseudo
			pseudos.push(pseudo);
        });
		
		//Quand quelqu'un se déconnecte
		socket.on("deconnect", function (pseudo) {
			socket.broadcast.emit("retirerPseudoDeco", pseudo);
			console.log(pseudo+" vient de se deco");
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
	console.log(pseudos);
	i = pseudos.indexOf(elementToBeDlt);
	pseudos.splice(i,1);
	console.log(pseudos);
}