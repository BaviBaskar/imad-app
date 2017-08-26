var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

var config = {
  user: 'bavi2baskar',
  password:process.env.DB_PASSWORD,
  database: 'bavi2baskar',
  host: 'db.imad.hasura-app.io'
};

var pool = new Pool(config);


var articles = {
	
	'article-one': {
		
		title : 'Article One',
		date : 'Aug 1 2017',
		content : `
		<p>
			This is first article.
		</p>
		`		
	},
	
	'article-two': {
		title : 'Article two',
		date : 'Aug 2 2017',
		content :  `
		<p>
			This is second article.
		</p>
		`		
	},
	
	'article-three': {
		title : 'Article three',
		date : 'Aug 3 2017',
		content :  `
		<p>
			This is three article.
		</p>
		`		
	}
	
};

function createHtml(data){
	
	var title = data.title;
	var date = data.date;
	var content = data.content;
var htmlTemplate = `
<html>
	<head>
		<title>${title}</title>
	</head>
<body>
	<div>
	${data.date}
	</div>
	<div>${data.content}</div>
</body>	
</html>

`;

return htmlTemplate;	
}


app.get('/test-db', function(req, res){
    pool.query("SELECT * FROM test", function(err, res){
       if(err){
           res.send(err.toString());
       } else{
           if(res.rows.length == 0){
               res.send("Rows not found.");
           }else {
               res.send(JSON.stringify(res.rows));
           }
       }
    });
   res
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleParam',function(req, res){
	var articleName = req.params.articleParam;
	res.send(createHtml(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
