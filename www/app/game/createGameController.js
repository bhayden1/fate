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
        vm.passphrase = '';   
        
        function createGame() {
            var game = Game(vm.name, vm.user, vm.passphrase);
            console.log(game)            
            db.createDocument(game).then(function(results) {
                console.log(results);
                $state.go('game', {dm:true, game: results.id})
            });            
        }
        window._t = db;        
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