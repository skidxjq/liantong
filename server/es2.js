var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '172.16.12.204:9200'
  // log: 'trace'
});


client.search({
  index: 'anti-2015.06.03',
  // type: 'ring-log',
  body: {
 
  "facets": {
    "terms": {
      "terms": {
        "field": "role",
        "size": 10,
        "order": "count",
        "exclude": []
      },
      "facet_filter": {
        "fquery": {
          "query": {
            "filtered": {
              "query": {
                "bool": {
                  "should": [
                    {
                      "query_string": {
                        "query": "_type:ring-log"
                      }
                    }
                  ]
                }
              },
              "filter": {
                "bool": {
                  "must": []
                }
              }
            }
          }
        }
      }
    }
  },
  "size": 0
}
}).then(function (resp) {
    // console.log(resp.facets.count);
    var hits = resp.hits.hits;
    console.log(resp.facets);
}, function (err) {
    console.trace(err.message);
});