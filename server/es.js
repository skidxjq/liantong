var esClient=require('elasticsearchClient');

var serverOptions = {
    hosts:[
        {
            host: '172.16.12.204',
            port: 9200
        }]
};


var esClientHandler = new esClient(serverOptions);

// var queryObj={
// 	"query":{
// 		"term":{
// 			"role":1
// 		}
// 	},
// 	"facets":{
// 		"facet1":{
// 			"terms":{

// 			}
// 		}
// 	}
// };

var qryObj = {
"query":{
"term":{
"role":1
}
},
"facets":{
"facet1":{
"terms":{
"field":"together",
"size":0
}
}
}
};

esClientHandler.search('anti-2015.06.03', 'ring-log', qryObj)
	.on('data',function(data){
		console.log(data);

	})
	.exec()