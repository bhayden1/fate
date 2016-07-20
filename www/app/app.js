var db;
angular.module('fateControllers', []);
angular.module('fateServices', []);

angular.module('fate', ['ionic', 'fateControllers', 'fateServices', 'ngCouchbaseLite'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('aspects', {
    url: '/aspects',
    controller: 'AspectController as vm',
    templateUrl: 'app/aspects/aspectView.html'
  });
  $urlRouterProvider.otherwise('/aspects');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
