angular.module('starter.controllers', [])

.controller('RegisterCtrl', function ($scope, $state, $ionicLoading,$rootScope) {

  localStorage.removeItem("questionsAnswered");
  localStorage.removeItem("questionsImgResult");
  localStorage.removeItem("questionsNameResult");
  localStorage.setItem("registered", "false");

  $scope.user = {};
  $scope.error = {};
  var registered = localStorage.getItem("registered");
  var answeredAllQuestions = localStorage.getItem("answeredAllQuestions");

  console.log("in registered");
  
  //console.log("registered : " + registered + " answeredAllQuestions " + answeredAllQuestions);

  if ( registered == "true" )
  {
      //console.log("here registered true");
      if ( answeredAllQuestions == null || answeredAllQuestions == false )
      {
          //console.log("here go to quiz");
          $state.go('tab.quiz', {clear: true});
      }
      else
      {
          $state.go('score', {clear: true});
      }
  }
  else
  {
    $scope.register = function () {

      $ionicLoading.show({
        template: 'Connexion en cours...'
      });

      if ( (typeof $scope.user.username === "undefined" && typeof $scope.user.email === "undefined") || ($scope.user.username == "" && $scope.user.email == "") )
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un nom & un email';
          $scope.$apply();
      }
      else if (typeof $scope.user.email === "undefined" || $scope.user.email == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un email';
          $scope.$apply();
      }
      else if ( typeof $scope.user.username === "undefined" || $scope.user.username == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un nom';
          $scope.$apply();
      }
      else // The user can be registered
      {
		  // TODO: test signing user:
		  console.log("username : "  + $scope.user.username + " email " + $scope.user.email);
		  
		  /*var user = new Parse.User();
          user.set("username", $scope.user.username);
          user.set("password", "solucom");
          user.set("email", $scope.user.email);
          localStorage.setItem("email", $scope.user.email);

          user.signUp(null, {
            success: function(user) {
              $ionicLoading.hide();
              $rootScope.user = user;
              //localStorage.setItem("registered", "true");

              Parse.User.logIn($scope.user.username, "solucom", {
                success: function(user) {
                  // Do stuff after successful login.
                },
                error: function(user, error) {
                  // The login failed. Check error to see why.
                }
              });

              $state.go('tab.quiz', {clear: true});
            },
            error: function(user, error) {
              $ionicLoading.hide();
              if (error.code === 125) {
                $scope.error.message = 'Veuillez saisir une adresse mail valide';
              } else if (error.code === 202) {
                $scope.error.message = 'Ce username est déjà utilisé';
              } else {
				Parse.User.logOut();
                $scope.error.message = error.message;
              }
              $scope.$apply();
            }
          });*/

		Parse.User.logIn($scope.user.username, "solucom", {
		  success: function(user) {
			// Do stuff after successful login.
			$ionicLoading.hide();
			$state.go('tab.quiz', {clear: true});
		  },
		  error: function(user, error) {
			// The login failed. Check error to see why.
			console.log(error);
			$ionicLoading.hide();
			Parse.User.logOut();
			$scope.error.message = 'Erreur de login';
			 $scope.$apply();
          }
		});
		//
      }
    };
  }
})

.controller('AboutCtrl', function($scope, $ionicPopup, $state) {

	var currentUser = Parse.User.current();
	var Consultant = Parse.Object.extend("Consultant");
	var query = new Parse.Query(Consultant);
	if( currentUser.get('Parrain') != null){
		query.get(currentUser.get('Parrain').id,{
		  success: function(results) {
			// Do something with the returned Parse.Object values
			$scope.user = currentUser;
			$scope.parrain = results;
			$scope.$apply();
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});

		$scope.extfile = function() {
			var f = "../img/revue_VF.pdf";
			console.log(f);
			var ref = window.open(f, '_self', 'location=yes', 'closebuttoncaption=Return');
		  };
		  
		  
		$scope.extfile2 = function() {
			var f = "../img/invitation.pdf";
			console.log(f);
			var ref = window.open(f, '_self', 'location=yes', 'closebuttoncaption=Return');
		  };
	}else{
		$scope.parrain = null;
	}

})

.controller('QuizCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading) {
	
	
	$scope.loadPractice = function(number) {
		if( parseInt(number, 10) == 1){
			localStorage.setItem("practice", "BT BA");
		}else if ( parseInt(number, 10) == 2){
			localStorage.setItem("practice", "BT ETT");
		}else if ( parseInt(number, 10) == 3){
			localStorage.setItem("practice", "EXL");
		}else if ( parseInt(number, 10) == 4){
			localStorage.setItem("practice", "RMS");
		}else if ( parseInt(number, 10) == 5){
			localStorage.setItem("practice", "ID");
		}else if ( parseInt(number, 10) == 6){
			localStorage.setItem("practice", "ASI");
		}else if ( parseInt(number, 10) == 7){
			localStorage.setItem("practice", "Direction Commerciale et Fonctions Transverses");
		}
		localStorage.setItem("practiceid", number);
		$state.go('practice', {clear: false});
	  };
	
	

})

.controller('PracticeCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading) {
	  
	 
	  $ionicLoading.show({
        template: 'Chargement des données...'
      });
	  
		var number = localStorage.getItem("practiceid");
	  
		var Candidat = Parse.Object.extend("Candidat");
		var query = new Parse.Query(Candidat);
		query.equalTo('practice', parseInt(number, 10));
		query.find({
		  success: function(results) {
			// Do something with the returned Parse.Object values
			$scope.workshop = localStorage.getItem("practice");
			$scope.workshops = results;
			$scope.$apply();
			$ionicLoading.hide();
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});
		
	$scope.loadWorkshop = function(number) {
		var Candidat = Parse.Object.extend("Candidat");
		var query = new Parse.Query(Candidat);
		query.equalTo('candidatid', parseInt(number, 10));
		query.find({
		  success: function(results) {
			// Do something with the returned Parse.Object values
			if( parseInt(number, 10) != 0){
				localStorage.setItem("workshop", results[0].get("name"));
			}else{
				localStorage.setItem("workshop", "");
			}
			localStorage.setItem("candidat_number", number);
			$state.go('comment', {clear: false});
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});
	  };
})

.controller('CommentCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading) {
	$scope.data = {};
	
	$ionicLoading.show({
        template: 'Chargement des données...'
      });

	var currentUser = Parse.User.current();
	var number = localStorage.getItem("candidat_number");
	
	var Comment = Parse.Object.extend("Comment");
    var query = new Parse.Query(Comment);
	query.equalTo('user', currentUser.id);
	query.equalTo('candidatid', parseInt(number, 10));
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		$scope.comments = results;
		$scope.workshop = localStorage.getItem("workshop");
		
		var Candidat = Parse.Object.extend("Candidat");
		var query = new Parse.Query(Candidat);
		query.equalTo('candidatid', parseInt(number, 10));
		query.find({
		  success: function(results) {
				$scope.candidat = results[0];
				localStorage.setItem("cv", results[0].get('cv'));
				$scope.$apply();
				$ionicLoading.hide();
			},
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
	
	$scope.extfile = function(name) {
			var f = "../img/" + localStorage.getItem("cv");
			console.log(f);
			var ref = window.open(f, '_self', 'location=yes', 'closebuttoncaption=Return');
		  };
		  
	$scope.delComment = function() {
		  
		  var Comment = Parse.Object.extend("Comment");
		  var currentUser = Parse.User.current();
		  var number = localStorage.getItem("candidat_number");
		  
		  var query = new Parse.Query(Comment);
		query.equalTo('user', currentUser.id);
		query.equalTo('candidatid', parseInt(number, 10));
		query.find({
			  success: function(results) {
				// The object was deleted from the Parse Cloud.
		 		results[0].destroy({});
				$scope.$apply();
				$state.go($state.current, {}, {reload: true});
			  },
			  error: function(myObject, error) {
				// The delete failed.
				// error is a Parse.Error with an error code and message.
			  }
			});
	};
	
	$scope.message = function(data) {
	  var Comment = Parse.Object.extend("Comment");
      var message = new Comment();
      var currentUser = Parse.User.current();

      message.set("text", data.messageText);
	  message.set("date", new Date());
      message.set("email", currentUser.get("email"));
	  message.set("like", $scope.data.feedbackQ2);
	  message.set("user", currentUser.id);
	  var number = localStorage.getItem("candidat_number");
	  message.set("candidatid", parseInt(number, 10));
	  
	  data.messageText="";

    message.save(null, {
		success: function(result) {
		  // Execute any logic that should take place after the object is saved.
			var Comment = Parse.Object.extend("Comment");
			var query = new Parse.Query(Comment);
			query.find({
			  success: function(results) {
				// Do something with the returned Parse.Object values
				$scope.messages = results;
				$scope.$apply();
				$state.go($state.current, {}, {reload: true});
			  },
			  error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			  }
			});
		},
		error: function(result, error) {
		  // Execute any logic that should take place if the save fails.
		  // error is a Parse.Error with an error code and message.
		  alert('Failed to create new object, with error code: ' + error.message);
		}
	});
  }
    
})

.controller('tabsCtrl', function($scope, $state) {

  $scope.endGame = function(){

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        return "ng-show";
    }

    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    if ( $scope.questionsAnswered.length == 3 ) {
      return "ng-hide";
    } else {
      return "ng-show";
    }
  }

});