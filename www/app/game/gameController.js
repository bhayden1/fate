(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('gameController', gameController);

    gameController.$inject = ['db', 'gameId', 'isDm', '$rootScope'];
    function gameController(db, gameId, isDm, $rootScope) {
        var vm = this;
        vm.isDm = isDm;
        vm.add = add;
        
        getGame()
            .then(setTitle)
            .then(listenToChange);

        function getGame() {
            return db.getDocument(gameId)
                .then(setGame)
                .then(groupAspects);
        }

        function setGame(game) {
            vm.game = game;
            return game;
        }

        function setTitle(game) {
            vm.title = game.name;
            return game;
        }

        function groupAspects(game) {
            vm.groupedAspects =
            game.aspects.reduce(function(source, aspect) {
                source[aspect.appliesTo] = source[aspect.appliesTo] || [];
                source[aspect.appliesTo].push(aspect);
                return source;
            }, {});
            return game;
        }

        function add() {
            var aspect = Aspect(vm.description, vm.appliesTo);
            vm.game.aspects.push(aspect);
            //TODO - do we need to listen for changes to update aspects
            //maybe in player mode only?
            db.updateDocument(vm.game._id, vm.game._rev, vm.game);
        }

        function listenToChange() {
            $rootScope.$on("couchbase:change", function(event, args) {
                var matchingResults = args.results.filter(function(result) {
                    return result.id === gameId;
                });

                if(matchingResults.length > 0) {
                    getGame();
                }
            });
        }
    }

    function Aspect(description, appliesTo) {
        return {
            description: description,
            appliesTo: appliesTo || 'environment',
        };
    }
})();