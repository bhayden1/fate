var resolvers = {
  db: function(couchbaseService) {
        return couchbaseService.get().then(function(db) {
          return db;
        })
      }
}

angular.module('fateControllers', []);
angular.module('fateServices', []);

angular.module('fate', ['ionic', 'fateControllers', 'fateServices', 'ngCouchbaseLite','ngStorage'])
.config(function($stateProvider, $urlRouterProvider) {
  // $stateProvider.state('aspects', {
  //   url: '/aspects',
  //   controller: 'AspectController as vm',
  //   templateUrl: 'app/aspects/aspectView.html'
  // });

  $stateProvider.state('game', {
    url: '/aspects/:game/:dm',
    templateUrl: 'app/game/game.html',
    controller: 'gameController as vm',
    resolve: {
      db: resolvers.db,
      isDm : function($stateParams) {
        return $stateParams.dm;
      },
      gameId: function($stateParams) {
        return $stateParams.game;
      }
    }
  })
  .state('createGame', {
    url: '/create',
    templateUrl: 'app/game/createGame.html',
    controller: 'createGameController as vm',
    resolve: {
      db: resolvers.db
    }
  })
  .state('joinGame', {
    url: '/join',
    templateUrl: 'templates/joinGame.html',
    controller: 'joinGameCtrl'
  })
  .state('fate', {
    url: '/welcome',
    templateUrl: 'app/welcome/welcome.html',
    controller: 'welcomeController as vm'
  })
  .state('myGames', {
    url: '/myGames',
    templateUrl: 'app/game/myGames.html',
    controller: 'myGamesController as vm', 
    resolve: {
      db: resolvers.db,
      email: function($localStorage) {
        return $localStorage.email;
      }
    }
  })

  $urlRouterProvider.otherwise('/welcome');
})

.run(function($ionicPlatform, couchbaseService, $interval) {
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

    var interval;
    var attempts = 0;
    var interval = $interval(function() {            
        couchbaseService.init();
        attempts++;
        if(attempts === 10) {
            $interval.cancel(interval);            
        }
    }, 200);      

  });
})