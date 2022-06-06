let express = require("express");
let app = express();
let fs = require('fs');

let info = fs.readFileSync("info.json");
info = JSON.parse(info);

/*const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "hulk.icnhost.net",
    port: 26,
    secure: false, // true for 465, false for other ports
    auth: {
        user: info.email, // email
        pass: info.email_password, // password
    }
});*/

var pgp = require('pg-promise')(/* options */);
var db = pgp(info.user);
let session = require('express-session');

// Certificate
// const privateKey = fs.readFileSync('../wizardsofthecode.online/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('../wizardsofthecode.online/cert.pem', 'utf8');
// const ca = fs.readFileSync('../wizardsofthecode.online/chain.pem', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };


var httpL = require('http')
var http = httpL.createServer(app);
//var https = require('https').createServer(credentials, app);

var io = require('socket.io')(http);
//var ioS = require('socket.io')(https);

// let aws_crypto = require('@aws-crypto/client-node');
let CryptoJS = require('crypto-js');

exports.express = express;
exports.app = app;

// exports.nodemailer = nodemailer;
// exports.transporter = transporter;
// exports.email = info.email;

exports.pgp = pgp;
exports.db = db;

exports.fs = fs;

exports.httpL = httpL;
exports.http = http;
//exports.https = https;

exports.session = session;
exports.io = io;
// exports.ioS = ioS;
// exports.aws_crypto = aws_crypto;
exports.CryptoJS = CryptoJS;

var enableCert = false;
if(enableCert) {
	var privateKey  = fs.readFileSync('cert/server.key', 'utf8');
	var certificate = fs.readFileSync('cert/server.crt', 'utf8');
	var credentials = {key: privateKey, cert: certificate};
	var httpsL = require('https');
	var https = httpsL.createServer(credentials, app);
	exports.https = https;
	var ios = require('socket.io')(https);
	exports.ios = ios;
}
else {
	exports.https = null;
	exports.ios = null;
}

let userIdToSockets = {}; //from user id to socket array
exports.userIdToSockets = userIdToSockets;

function emitToUser(id, name, data) {
	var sockets = userIdToSockets[id];
	if(sockets) {
		for(let j = 0; j < sockets.length; j++){
			sockets[j].emit(name, data);
		}
	}
}
exports.emitToUser = emitToUser;