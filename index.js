const http = require('http');

http.createServer((req,res)=>{
	res.writeHead(200,{'Content-Type':'text\html'});
	res.end("Welcome Home");
}).listen(7373);

console.log('Node Server running at : '+7373);
