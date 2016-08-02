describe('my games controller', function() {
    var vm;
    var mockDb = {
        queryView: function() {}
    };
    var scope;
    beforeEach(function() {
        angular.mock.module('fate');
        angular.mock.module('fateControllers')

        inject(function($controller, $rootScope, $q) {
            scope = $rootScope;
            spyOn(mockDb, 'queryView').and.returnValue($q.when({rows: [{value:{}},{value:{}},{value:{}}]}));
            vm = $controller('myGamesController', {
                db: mockDb,
                email: 'a@a.com'
            });
        })
    });

    it('should exist', function(){
        expect(vm).toBeTruthy();
    });

    it('should get a list of all the user\'s games', function() {
        scope.$apply();
        expect(vm.games.length > 0).toBe(true);
    });

    it('should call the correct view', function() {
        expect(mockDb.queryView).toHaveBeenCalledWith('_design/games', 'games');
    });
});