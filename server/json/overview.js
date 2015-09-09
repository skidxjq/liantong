/**
 * Created by mac on 15-8-27.
 */
var output = {};
output.pieData = {};


//获得总通话次数json
output.totalCountJson = {
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
};

//获得通话次数占比请求提
output.pieData.callCountMakeUpJson = {
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
};

//获得通话时长占比请求体
output.pieData.callPeriodMakeUpJson = {
    "facets": {
        "terms": {
            "terms_stats": {
                "value_field": "elapsedTime",
                "key_field": "role",
                "size": 10,
                "order": "term"
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



//exports.totalCountJson = totalCountJson;

module.exports = output;