var express = require('express'),
	app = express();

app.use(express.static(__dirname));

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.listen(8000, function() {
 console.log('listening on port 8000!');
});