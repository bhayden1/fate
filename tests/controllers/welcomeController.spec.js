describe('welcome controller', function() {
    var vm;
    var localStorage;
    beforeEach(function() {
        angular.mock.module('fate');
        angular.mock.module('fateControllers');
        inject(function($controller, couchbaseService, $state, $rootScope, $q, $localStorage) {
            service = couchbaseService;
            state =$state;
            scope = $rootScope;
            spyOn(state, 'go');
            localStorage = $localStorage;
            vm = $controller('welcomeController', {
                $localStorage: $localStorage
            });                        
        });
    });

    it('should exist', function() {
        expect(vm).toBeTruthy();
    });

    it('should put email in local storage', function() {
        vm.$storage.email = 'a@a.com';
        expect(localStorage.email).toBe('a@a.com')
    });
});