describe('create game controller', function() {
    var vm;
    var service;
    var state;
    var localStorage;
    var game = {
        id: 1        
    }
    var scope;
    var db = {createDocument: function() {}};
    beforeEach(function() {
        angular.mock.module('fate');
        angular.mock.module('fateControllers');
        inject(function($controller, couchbaseService, $state, $rootScope, $q, $localStorage) {            
            state =$state;
            scope = $rootScope;
            localStorage = $localStorage;            
            localStorage.email = 'test@test.com'            
            spyOn(db, 'createDocument').and.returnValue($q.when(game));
            spyOn(state, 'go');
            
            vm = $controller('createGameController', {                
                $state: state,
                $localStorage: localStorage,
                db: db
            });                        
        });
    });

    it('should exist', function() {
        expect(vm).toBeTruthy();
    });

    it('should get email out of local storage', function() {
        expect(vm.user).toBe(localStorage.email);
    });

    describe('create game', function() {
        it('should go to game view', function() {
            vm.name = 'Test Game';
            vm.createGame();
            scope.$apply();
            expect(state.go).toHaveBeenCalledWith('game', {dm:true, game: game.id});
        });

        it('should create a game with the couchbaseService', function() {
            vm.name = 'game';
            vm.passphrase = '1234';
            vm.user = 'a@a.com'
            vm.createGame();
            scope.$apply();
            expect(db.createDocument).toHaveBeenCalledWith({name: 'game', passphrase: '1234', owner: 'a@a.com', channels: ['a@a.com'], characters: [], aspects:[], type: 'game'});
        });        
    });

    //create game button clicked
        //go to game view
        //take game name and password and create game document  
        // {
        //     name: '',
        //     password: '',
        //     aspects: [],
        //     characters: [],
        //     owner: '' //email address
        //     channels: [] //email address

        // }
});