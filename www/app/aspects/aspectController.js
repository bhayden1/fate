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
        vm.init = init;
        
        var attempts = 0;
        var interval;
        var interval = $interval(function() {
            console.log('Attempts: ' + attempts);
            init();
            attempts++;
        }, 200);        

        function add() {
            var aspect = Aspect(vm.description)           
            vm.description = '';
            db.createDocument(aspect)
              .catch(function(err) { console.log(err);});
        }        

        function init() {
            couchbaseService
                .init()
                .then(function(result) {
                    db.queryView('_design/aspects', 'aspects').then(function(results) {                        
                      vm.aspects = results.rows.map(function(row) {
                          var aspect = Aspect(row.value.description, row.value.appliesTo);
                          aspect.id = row.id;
                          return aspect;
                      });
                      listenToChange();  
                      if(interval) {
                          $interval.cancel(interval);
                      }
                    });
                });
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