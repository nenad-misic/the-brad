
//scame1997!
var nStatic = require('node-static');
var http = require('http');
var WebSocketServer = require('websocket').server;
const multer = require('multer');

var port = process.env.PORT || 1337;
var fileServer = new nStatic.Server('./public');

var client1 = null;
var client2 = null;

var pattern = 'AAAAA'

var generatePattern = () => {
	let lista = ['A','S','D']
	let first = lista[Math.floor(Math.random()*3)]
	let listaZaDrugaDva = lista.filter(e => e!=first);
	let second = listaZaDrugaDva[Math.floor(Math.random()*2)]
	let third = listaZaDrugaDva.filter(e => e!=second)[0];
	let listaBezTreceg = lista.filter(e => e!=third);
	let fourth = listaBezTreceg[Math.floor(Math.random()*2)]
	let listaZaPoslednji = lista.filter(e => e!=fourth);
	let fifth = listaZaPoslednji[Math.floor(Math.random()*2)]
	return `${first}${second}${third}${fourth}${fifth}`;
}


var server = http.createServer(function (request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');

	if (request.method === 'POST') {
		let body = '';
		request.on('data', chunk => {
			body += chunk.toString(); // convert Buffer to string
		});
		request.on('end', () => {
			response.writeHead(200, {'Content-Type': 'application/json'});
			message = JSON.parse(body).message;
			response.end('okoi');
		});
	}

	if (request.method === 'GET') {
		switch (request.url) {
			case '/dummy':
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify({'working': true}));
				break;
				
			case '/smarty':
				for (let i in clients) {
					clients[i].sendUTF(JSON.stringify({'working': 'very well'}));
				}
				break;
		default:
			fileServer.serve(request, response);
			break;
		}
	}
	
})

server.listen(port);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
	var connection = request.accept();
	
	if(client1 && client2) return;
	if(client1) {client2 = connection;} else {client1 = connection;}

	if(client1 && client2) {
		client1.sendUTF(JSON.stringify({type: 'connected'}))
		client2.sendUTF(JSON.stringify({type: 'connected'}))

		pattern = generatePattern();

		client1.sendUTF(JSON.stringify({type: 'pattern', data: pattern}))
		client2.sendUTF(JSON.stringify({type: 'pattern', data: pattern}))

		client1.sendUTF(JSON.stringify({type: 'start'}))
	}

    connection.on('close', function(reasonCode, description) {
		if(client1 == connection) client1 = null;
		if(client2 == connection) client2 = null;
		console.log("Connection closed");
    });
});


