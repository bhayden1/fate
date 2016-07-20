(function() {
'use strict';

    angular.module('fateServices')
        .factory('couchbaseService', CouchbaseService);

    CouchbaseService.$inject = ['$couchbase', '$q'];
    function CouchbaseService($couchbase, $q) {        
        var service = {
            init: init                       
        };
        
        return service;
        
        function init() {
            return getCouchbaseUrl()
                    .then(initDbVar)
                    .then(createOrGetDb)
                    .then(replicate)
                    .catch(errorHandler)
                    .finally(listen);
        }

        function getCouchbaseUrl() {
            var deferred = $q.defer();          
            if(window.cblite) {
                window.cblite.getURL(function(err, url) {              
                    deferred.resolve(url)
                }, function(err) {
                    deferred.reject(err);
                });
            } else {                                
                deferred.reject('couchbase not enabled');
            }

            return deferred.promise;
        }
        
        function initDbVar(url) {
            if(!url) {
                console.log('no url');
                return;
            }
            return db = new $couchbase(url, 'aspects');
        }

        function createOrGetDb() {
            return db.getDatabase()
              .then(function(response) {
                  console.log(response);
                  return response;
              })
              .catch(function(error) {
                  console.log(error);
                  return db.createDatabase()
                           .then(createTodoDocument)
                           .catch(errorHandler);
              });
        }

        function createTodoDocument(result) {            
            var todoViews = {
                aspects: {
                    map: function(doc) {
                        if(doc.type == "aspect" && doc.description) {
                            emit(doc._id, {description: doc.description, rev: doc._rev, appliesTo: doc.appliesTo})
                        }
                    }.toString()
                }
            };            
            return db.createDesignDocument("_design/aspects", todoViews)
                     .catch(errorHandler);
        }

        function replicate(result) {
            return db.replicate('aspects', 'http://doctest-5u5ybzm3.cloudapp.net:4984/aspects', true)
                     .then(function(result) {
                        console.log(result);
                     })
                     .then(function() {
                         return db.replicate('http://doctest-5u5ybzm3.cloudapp.net:4984/aspects', 'aspects', true)
                                  .then(console.log);
                     });

        }

        function listen() {
            console.log('listening');
            return db.listen();
        }

        function errorHandler(error) {
            console.log(error);
        }
    }
})();