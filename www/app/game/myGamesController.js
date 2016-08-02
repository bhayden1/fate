(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('myGamesController', myGamesController);

    myGamesController.$inject = ['db', 'email'];
    function myGamesController(db, email) {
        var vm = this;
        
        db.queryView('_design/games', 'games')
          .then(function(results) {
              console.log(results);
              vm.games = results.rows.map(function(row) {
                  return {
                      id: row.id,
                      name: row.value.name
                  }
              });
          });
    }
})();