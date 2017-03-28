angular.module('courseManager', ['ionic', 'courseManager.controllers', 'courseManager.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
          }
        }
      })

      .state('app.course', {
        url: '/course/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/course.html',
            controller: 'UpdateController'
          }
        }
      })

      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'RegisterController'
          }
        }
      })

      .state('app.aboutus', {
        url: '/aboutus',
        views: {
          'menuContent': {
            templateUrl: 'templates/aboutUs.html'
          }
        }
      })

    // .state('app.playlists', {
    //   url: '/playlists',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/playlists.html',
    //       controller: 'PlaylistsCtrl'
    //     }
    //   }
    // })

    // .state('app.single', {
    //   url: '/playlists/:playlistId',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/playlist.html',
    //       controller: 'PlaylistCtrl'
    //     }
    //   }
    // });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/aboutus');
  });
