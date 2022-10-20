var http = require("http"),
    url = require("url"),
    port = process.argv[2] || 8181;

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    if (uri === '/hello-world') {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("nodejs hello world\n");
        response.end();
        return;
    }
}).listen(parseInt(port, 10));

if (process.send) process.send('ready')
console.log("\n  => http://localhost:" + port + "/hello-world\nCTRL + C to shutdown\n");