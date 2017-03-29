angular.module('courseManager.controllers', [])

  .controller('AppCtrl', ['$scope', '$ionicModal', '$rootScope', '$state', 'loginFactory',
    function ($scope, $ionicModal, $rootScope, $state, loginFactory) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      $scope.showAlert;
      $scope.message = 'Username or password is incorrect';

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function () {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function () {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function () {

        loginFactory.query({
          username: $scope.loginData.username
        }).$promise.then(
          (response) => {
            if (response.length > 0) {
              if (response[0].password == $scope.loginData.password) {
                $state.go('app.home');
                $rootScope.username = $scope.loginData.username;
                $scope.modal.hide();
                $scope.loginData = {};
                $scope.showAlert = false;
              } else
                $scope.showAlert = true;
            } else {
              $scope.showAlert = true;
            }
          },
          (response) => {
            $scope.showAlert = true
          }
          );
      };
    }])

  .controller('HomeController', ['$scope', '$rootScope', '$state', '$stateParams', 'coursesFactory', 'courseFactory',
    function ($scope, $rootScope, $state, $stateParams, coursesFactory, courseFactory) {
      $scope.message = "Loading ...";
      $scope.courses = [];
      $scope.loading = true;

      $scope.shouldShowDelete = false;
      $scope.listCanSwipe = true

      coursesFactory.query({
        username: $rootScope.username
      }).$promise.then(
        (response) => {
          $scope.courses = response;
          $scope.loading = false;
        },
        (response) => {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
        );

      $scope.deleteCourse = (id) => {
        courseFactory.delete({ id: id },
          (response) => {
            $scope.courses = coursesFactory.query({
              username: $rootScope.username
            });
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );
      };
      $scope.addCourse = () =>{
        $state.go('app.newCourse');
      } 

    }])

  .controller('UpdateController', ['$scope', '$state', '$stateParams', 'courseFactory', 'coursesFactory', 'authorsFactory',
    function ($scope, $state, $stateParams, courseFactory, coursesFactory, authorsFactory) {

      $scope.message = "Loading Course...";
      $scope.loading = true;

      $scope.regex = '\\d+:?\\d*';

      $scope.course =
        courseFactory.query({
          id: $stateParams.id
        }).$promise.then(
          (response) => {
            $scope.course = response[0];
            $scope.loading = false;
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
          );

      $scope.authors =
        authorsFactory.query(
          (response) => {
            $scope.authors = response;
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );

      $scope.updateCourse = () => {

        courseFactory.update({ id: $stateParams.id }, $scope.course,
          (response) => {
            $scope.courses = coursesFactory.query();
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );

        $state.go('app.home');

      };
    }])

  .controller('AddController', ['$scope', '$rootScope', '$state', '$stateParams', 'courseFactory', 'coursesFactory', 'authorsFactory',
    function ($scope, $rootScope, $state, $stateParams, courseFactory, coursesFactory, authorsFactory) {

      $scope.course = {
        "title": '',
        "authorId": 0,
        "length": '',
        "category": '',
        "username": $rootScope.username
      };

      $scope.regex = '\\d+:?\\d*';

      $scope.authors =
        authorsFactory.query(
          (response) => {
            $scope.authors = response;
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );

      $scope.addCourse = () => {

        courseFactory.save($scope.course,
          (response) => {            
            $scope.courses = coursesFactory.query();
          },
          (response) => {
          }
        );       

      };
    }])

  .controller('RegisterController', ['$scope', '$state', 'registerFactory',
    function ($scope, $state, registerFactory) {

      $scope.user = {
        "firstName": '',
        "lastName": '',
        "username": '',
        "password": ''
      };

      $scope.register = () => {

        registerFactory.save($scope.user,
          (response) => {
            $state.go('app.aboutus');
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );
      }
    }])

  .controller('AddAuthorController', ['$scope', '$rootScope', '$state', '$stateParams', 'authorsFactory',
    function ($scope, $rootScope, $state, $stateParams, authorsFactory) {

      $scope.author = {
        "firstName": '',
        "lastName": ''
      };

      $scope.addAuthor = () => {

        authorsFactory.save($scope.author,
          (response) => {
            $scope.authors = authorsFactory.query();
          },
          (response) => {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );

        $state.go('app.home');

      };
    }])

