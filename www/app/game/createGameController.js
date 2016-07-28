(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('createGameController', createGameController);

    createGameController.$inject = ['$state', '$localStorage', 'db'];
    function createGameController($state, $localStorage, db) {
        var vm = this;
        vm.createGame = createGame;   
        vm.user = $localStorage.email;     
        console.log(db);
        function createGame() {
            var game = Game(vm.name, vm.user, vm.passphrase);            
            db.createDocument(game).then(function(game) {
                $state.go('game', {dm: true, game: game.id});
            });            
        }
    }

    function Game(name, owner, passphrase) {
        return {
            name: name,
            passphrase: passphrase,
            owner: owner,
            channels: [owner],
            aspects: [],      
            characters: [],      
            type: 'game'
        }
    }
})();