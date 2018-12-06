#!/usr/bin/env node
"use strict";function _interopDefault(a){return a&&"object"==typeof a&&"default"in a?a["default"]:a}var yargs=_interopDefault(require("yargs")),process$1=_interopDefault(require("process")),express=_interopDefault(require("express")),bodyParser=_interopDefault(require("body-parser")),chalk=_interopDefault(require("chalk")),readline=_interopDefault(require("readline")),fs=_interopDefault(require("fs")),http=_interopDefault(require("http")),path=_interopDefault(require("path")),ws=_interopDefault(require("ws")),options=yargs.option("port",{alias:"p",describe:"The port that the application will run on.",default:5e3,number:"number"}).option("cleanup",{alias:"c",describe:"Cleanup all data files after the server finishes running.",default:!0,type:"boolean"}),args=options,deleteFolderRecursive=function a(b){fs.existsSync(b)&&(fs.readdirSync(b).forEach(function(c){var d=b+"/"+c;fs.lstatSync(d).isDirectory()?a(d):fs.unlinkSync(d)}),fs.rmdirSync(b))},exitHandler=function(a){var b=function(b){return function(c){a.cleanup&&(deleteFolderRecursive("./data"),console.log(chalk.yellow("Cleaning up data files..."))),"uncaughtException"===b?(console.log(chalk.red("Exiting due to an uncaughtException...")),console.log(chalk.red(c)),process$1.exit(1)):(console.log(chalk.yellow("Exiting normally or due to user termination...")),process$1.exit(0))}};["exit","SIGINT","SIGUSR1","SIGUSR2","uncaughtException","SIGTERM"].forEach(function(a){process$1.on(a,b(a))})},exitHandler_1=exitHandler,usernameHandler={users:[],checkUsername:function(a){return!this.users.map(function(a){return a.username}).includes(a)&&a.trim()},addUsername:function(a,b){this.users.push({username:a.trim(),ip:b})},removeUsername:function(a){var b=this.users.length;return this.users=this.users.filter(function(b){return b.username!==a}),this.users.length!==b},findUsername:function(a){var b=this.users.filter(function(b){return b.ip===a});return b.length?b[0].username:null}},usernameHandler_1=usernameHandler,router=express.Router(),customRouter=function(a){return router.use(bodyParser.json()),router.post("/users",function(b,c){var d=b.body.username;a.checkUsername(d)?(a.addUsername(d,b.ip),c.setHeader("Content-Type","application/json"),c.status(200).send(JSON.stringify({username:d}))):(c.setHeader("Content-Type","application/json"),c.status(409).send(JSON.stringify({username:void 0})))}),router},router_1=customRouter,lineParser=function(a){var b=readline.createInterface({input:process.stdin,output:process.stdout});return b.on("line",function(b){var c=b.trim();if("exit"===c&&process.exit(0),"users"===c&&console.log(chalk.cyan("Connected users:\n".concat(a.users.map(function(a){return"".concat(a.username,"@").concat(a.ip)}).join("\n")))),c.startsWith("kick ")){var d=c.slice(5).trim();a.removeUsername(d)?console.log(chalk.green("User '".concat(d,"' successfully removed."))):console.log(chalk.yellow("No user '".concat(d,"'.")))}"help"===c&&console.log(chalk.cyan("Available commands:\nexit          Terminate the server.\nusers         Show a list of connected users.\nkick <user>   Remove a user from the server."))}),b},lineParser_1=lineParser,dataLogger={logData:function(a,b){fs.appendFileSync(a,"".concat(JSON.stringify(b),"\n"))}},dataLogger_1=dataLogger,MESSAGE_CODES={error:-1,system:0,message:1},messageCodes={MESSAGE_CODES:MESSAGE_CODES},MESSAGE_DESCRIPTORS={established:"CONN_ESTABLISHED",terminated:"CONN_TERMINATED",welcome:"USER_WELCOME"},messageDescriptors={MESSAGE_DESCRIPTORS:MESSAGE_DESCRIPTORS},argv=args.argv,exitHandler$1=exitHandler_1(argv),router$1=router_1(usernameHandler_1),lineParser$1=lineParser_1(usernameHandler_1),MESSAGE_CODES$1=messageCodes.MESSAGE_CODES,MESSAGE_DESCRIPTORS$1=messageDescriptors.MESSAGE_DESCRIPTORS,app=express();app.use(express.static(path.join(__dirname,"public"))),app.use("/",router$1);var server=http.createServer(app),socketServer=new ws.Server({server:server,clientTracking:!0});socketServer.on("connection",function(a,b){console.log(chalk.cyan("Established connection with client on the following IP address: ".concat(b.connection.remoteAddress)));var c={user:usernameHandler_1.findUsername(b.connection.remoteAddress),message:MESSAGE_DESCRIPTORS$1.welcome,timestamp:new Date,messageCode:MESSAGE_CODES$1.system};a.send(JSON.stringify(c)),a.isAlive=!0,a.ip=b.connection.remoteAddress,a.on("message",function(c){var d=usernameHandler_1.findUsername(b.connection.remoteAddress);if(null===d)return a.terminate();var e=JSON.parse(c);e.messageCode=e.messageCode==MESSAGE_CODES$1.system&&Object.values(MESSAGE_DESCRIPTORS$1).includes(e.message)?MESSAGE_CODES$1.system:MESSAGE_CODES$1.message,e.timestamp=new Date,e.messageCode===MESSAGE_CODES$1.message&&dataLogger_1.logData("./data/messages.data",e),d!==e.user&&console.log(chalk.yellow("Bogus request from IP: ".concat(b.connection.remoteAddress))),socketServer.clients.forEach(function(a){a.send(JSON.stringify(e))})}),setInterval(function(){socketServer.clients.forEach(function(b){if(!b.isAlive){console.log(chalk.cyan("Terminating connection with client on the following IP address: ".concat(b.ip," - Cannot reach client at this time.")));var c=usernameHandler_1.findUsername(a.ip);usernameHandler_1.removeUsername(c),b.terminate(),socketServer.clients.forEach(function(a){var b={user:c,message:MESSAGE_DESCRIPTORS$1.terminated,timestamp:new Date,messageCode:MESSAGE_CODES$1.system};a.send(JSON.stringify(b))})}b.isAlive=!1,b.ping(null,!1,!0)})},1e4),a.on("pong",function(){a.isAlive=!0}),a.on("close",function(b,c){console.log(chalk.cyan("Terminating connection with client on the following IP address: ".concat(a.ip," -").concat(c,"(").concat(b,")")));var d=usernameHandler_1.findUsername(a.ip);usernameHandler_1.removeUsername(d),a.terminate(),socketServer.clients.forEach(function(a){var b={user:d,message:MESSAGE_DESCRIPTORS$1.terminated,timestamp:new Date,messageCode:MESSAGE_CODES$1.system};a.send(JSON.stringify(b))})})}),fs.existsSync("./data")||fs.mkdirSync("./data"),server.listen(argv.port,function(){console.log(chalk.green("Server started.")),console.log(chalk.green("Listening on port ".concat(argv.port,"...")))});var server_1={};module.exports=server_1;
