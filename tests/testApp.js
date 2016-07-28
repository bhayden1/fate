angular.module('fateControllers', []);
angular.module('fateServices', []);

angular.module('fate', ['ionic', 'fateControllers', 'fateServices', 'ngCouchbaseLite', 'ngStorage'])
.value('db', {})