describe('game controller', function() {
    var vm;
    var mockDb = {
        getDocument: function() {}
    };
    var scope;
    var q;

    beforeEach(function() {
        angular.mock.module('fate');
        angular.mock.module('fateControllers');
        inject(function($controller, $q, $rootScope) {
            scope = $rootScope;
            spyOn(mockDb, 'getDocument')
                .and.returnValue(
                    $q.when({_id: 1, name: 'match'})
                );
            q = $q;
            vm = $controller('gameController', {
                gameId: 1,
                isDm: true,
                db: mockDb
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

    it('should set game to game from db', function() {        
        scope.$apply();
        expect(vm.game.name).toBe("match");
    });
})