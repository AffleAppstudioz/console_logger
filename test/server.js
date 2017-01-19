var express = require("express");
var app = express();
require("console_logger")();
app.get("/",function(){
	console.log("This is my test log");
})

app.listen(8000);
console.log("Server start at 8000");
console.log("open http://localhost:8000 for testing ")