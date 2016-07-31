describe('game controller', function() {
    var vm;
    var mockDb = {
        getDocument: function() {},
        updateDocument: function() {}
    };
    var scope;
    var q;
    var game = {
        _id: 1,
        name: 'match',
        _rev: 4, 
        aspects: [{
            appliesTo: 'player1',
            desc: 'Ho hum'
        },
        {
            appliesTo: 'player1',
            desc: 'Yo hum'
        },
        {
            appliesTo: 'environment',
            desc: 'Ruh roh'
        }]
    }

    beforeEach(function() {
        angular.mock.module('fate');
        angular.mock.module('fateControllers');
        inject(function($controller, $q, $rootScope) {
            scope = $rootScope;
            spyOn(mockDb, 'getDocument').and.returnValue($q.when(game));
            spyOn(mockDb, 'updateDocument');
            vm = $controller('gameController', {
                gameId: 1,
                isDm: true,
                db: mockDb,
                $rootScope: scope
            });
        });
    });

    it('should exist', function() {
        expect(vm).toBeTruthy();
    });

    it('should set isDm', function() {
        expect(vm.isDm).toBe(true);
    });

    it('should call to get document', function() {
        expect(mockDb.getDocument).toHaveBeenCalledWith(1)
    });

    it('should set title to game name', function() {
        scope.$apply();
        expect(vm.title).toBe(game.name);
    })

    it('should set game to game from db', function() {        
        scope.$apply();
        expect(vm.game.name).toBe("match");
    });

    it('should group the aspects', function() {
        scope.$apply();
        expect(vm.groupedAspects.player1.length).toBe(2);
    });

    describe('add', function() {
        it('should call update document', function() {
            scope.$apply();
            vm.description = 'new aspect';
            vm.appliesTo =  'player2';
            vm.add();
            game.aspects.push({description: 'new aspect', appliesTo: 'player2'});
            expect(mockDb.updateDocument).toHaveBeenCalledWith(1, 4, game);
        });
    })
})