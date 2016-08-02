(function() {
'use strict';

    angular.module('fateServices')
        .factory('couchbaseService', CouchbaseService);

    CouchbaseService.$inject = ['$couchbase', '$q', '$localStorage'];
    function CouchbaseService($couchbase, $q, $localStorage) {        
        var db;
        var service = {
            init: init,
            get: getDb                                
        };

        
        return service;       

        function init() {
            return getCouchbaseUrl()
                    .then(initDbVar)
                    .then(createOrGetDb)
                    .then(replicateToCloud)
                    .then(replicateFromCloud)
                    .then(listen)
                    .then(getDb)
                    .catch(errorHandler);                                  
        }

        function getDb() {            
            return (db) ? $q.when(db) : init();
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
            db = new $couchbase(url, 'aspects');            
            return db;
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
                           .then(createFateViews);                           
              });
        }

        function createFateViews(result) {
            var fateViews = {
                games: {
                    map: function(doc) {                  if(doc.type == "game" && doc.name) {
                            emit(doc._id, {
                                name: doc.name, 
                                rev: doc._rev, 
                                passphrase: doc.passphrase, 
                                aspects: doc.aspects, 
                                characters: doc.characters
                            })
                        }
                    }.toString()
                }
            };            
            return db.createDesignDocument("_design/games", fateViews);                     
        }

        function replicateToCloud(result) {            
            return db.replicate('aspects', 'http://doctest-5u5ybzm3.cloudapp.net:4984/aspects', true, $localStorage.email);
        }

        function replicateFromCloud(result) {
            return db.replicate('http://doctest-5u5ybzm3.cloudapp.net:4984/aspects', 'aspects', true, $localStorage.email);                                  
        }

        function listen() {            
            db.listen();
            return db;
        }

        function errorHandler(error) {
            console.log(error);
        }
    }
})();