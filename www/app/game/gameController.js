(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('gameController', gameController);

    gameController.$inject = ['db', 'gameId', 'isDm'];
    function gameController(db, gameId, isDm) {
        var vm = this;
        vm.isDm = isDm;
        
        db.getDocument(gameId).then(function(game) {
            console.log(game);
            vm.game = game;
        });
    }
})();