(function() {
'use strict';

    angular
        .module('fateControllers')
        .controller('welcomeController', WelcomeController);

    WelcomeController.$inject = ['$localStorage'];
    function WelcomeController($localStorage) {
        var vm = this;
        vm.$storage = $localStorage;        
    }
})();