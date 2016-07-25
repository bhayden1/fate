(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('AspectController', AspectController);        
    AspectController.$inject = ['couchbaseService', '$rootScope', '$interval'];
    function AspectController(couchbaseService, $rootScope, $interval) {
        var vm = this;
        vm.add = add;
        vm.aspects = [];
        vm.description = '';        
        
        var attempts = 0;
        var interval;
        var interval = $interval(function() {            
            init();
            attempts++;
            if(attempts === 10) {
                $interval.cancel(interval);
                vm.aspects.push(Aspect('Test', 'environment'))
            }
        }, 200);        

        function add() {
            var aspect = Aspect(vm.description)           
            vm.description = '';
            db.createDocument(aspect)
              .catch(function(err) { console.log(err);});
        }        

        function remove(aspect) {
            console.log(aspect);
        }

        function init() {
            couchbaseService
                .init()
                .then(queryAspects)
                .then(mapAspects)
                .then(listenToChange)
                .then(clearInterval)
                .catch(function(err) {
                    console.log(err);
                });
                
        }

        function queryAspects(result) {
            return db.queryView('_design/aspects', 'aspects');
        }

        function mapAspects(results) {
            vm.aspects = results.rows.map(function(row) {
                          var aspect = Aspect(row.value.description, row.value.appliesTo);
                          aspect.id = row.id;
                          return aspect;
                      });
            return results;
        }
    
        function listenToChange() {
            $rootScope.$on("couchbase:change", function(event, args) {
                args.results.forEach(function(result) {
                    if(result.id) {
                        db.getDocument(result.id).then(function(document) {
                            var aspect = Aspect(document.description, document.appliesTo);
                            aspect.id = result.id;
                            vm.aspects.push(aspect);
                        });
                    }
                });
            });
        }

        function clearInterval(result) {
            if(interval) {
                $interval.cancel(interval);
            }
            return result;
        }
    }

    function Aspect(description, appliesTo) {
        return {
            description: description,
            appliesTo: appliesTo || 'environment',
            type: 'aspect',
            owner: 'guest'
        };
    }
})();