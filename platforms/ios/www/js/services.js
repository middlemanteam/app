var proxy = servName + "/api";
var proxy2 = servName + "";
//var proxy = "/api";

angular.module('app.services', [])

.factory('AuthService', function($http, $state, $ionicLoading, store){
  var currentUser;
  return {
    login: function(username, password){
      $ionicLoading.show();
      $http.post(proxy2 + '/login',{'username': username, 'password': password, "pushToken": window.localStorage.getItem("pushToken")}).then(function(response){
        if(response.data !== "invalid"){
          store.set("TOKEN", response.data.token);
          store.set("REFRESH_TOKEN", response.data.refreshToken);
          window.localStorage.setItem("EASY_MODE", response.data.user.settings.general.easyMode);
          window.localStorage.setItem("USER", response.data.user.username);
          currentUser = response.data.user;
          $ionicLoading.hide();
          if(currentUser.loggedInBefore){
            if(currentUser.settings.general.easyMode){
              $state.go('easy.askFavor');
			  
            }else{
              $state.go('tabs.home');
            }
          }else{
            $state.go('tour');
          }

        }else{
          $ionicLoading.show({
            template: "Invalid Username or Password",
            duration: 2000
          });
        }
      });
    },
    logout: function(){
      store.remove("TOKEN");
      window.localStorage.removeItem("USER");
      $state.go("landing");
    },
    isLoggedIn: function(){
      return typeof currentUser !== 'undefined';
    },
    currentUser: function(){
      return $http.get(proxy + '/users/'+window.localStorage.getItem("USER")).then(function(response){
        return response.data;
      });
    }
  };
})

.factory('JobLocations', function($http){
  var jobs = {};
  var tasks = [];

  jobs.getTasks = function(username){
    return $http.get(proxy + '/tasks/' + username).then(function(response){
      tasks = response.data;
      return response.data;
    });
 };

  jobs.getTask = function(id){
    return $http.get(proxy + '/task/' + id).then(function(response){
      return response.data;
    });
 };

  jobs.addMessage = function(message){
    return $http.post(proxy + '/addMessage', {"message": message}).then(function(response){
      return response.data;
    });
 };

  jobs.markAsRead = function(taskID, username){
    return $http.post(proxy + '/markAsRead', {"taskID": taskID, "receiver": username}).then(function(response){
      return response.data;
    });
 };

  jobs.addTask = function(task){
    return $http.post(proxy + '/addTask', {"task": task});
 };

  jobs.repostTask = function(task){
    return $http.post(proxy + '/repostTask', {"task": task}).then(function(response){
      return response.data;
    });
 };

  return jobs;
})

.factory('Users', function($http){
  var users = {};

  users.createUser = function(user){
    return $http.post(proxy2 + '/createUser', {"user": user});
  };

  users.getUsernames = function(){
    return $http.get(proxy2 + '/usernames').then(function(response){
      return response.data;
	});
};

  users.getUser = function(username){
    return $http.get(proxy + '/users/'+username).then(function(response){
      return response.data;
    });
  };

  users.getUsers = function(){
    return $http.get(proxy + '/users').then(function(response){
      return response.data;
    });
  };

  users.getTrustedBy = function(username){
    return $http.get(proxy + '/trustedBy/'+username).then(function(response){
      return response.data;
    });
 };

  users.getTrusts = function(username){
    return $http.get(proxy + '/trusts/'+username).then(function(response){
      return response.data;
    });
 };

  users.pay = function(task, payment){
    return $http.post(proxy +'/pay', {"task": task, "payment": payment}).then(function(response){
      return response.data;
    });
 };

  users.resetPassword = function(email){
    return $http.post(proxy2 + '/resetPassword', {"email": email}).then(function(response){
      return response.data;
    });
 };

  users.getNotifications = function(username){
    return $http.post(proxy + '/getNotifications', {"username": username}).then(function(response){
      return response.data;
    });
 };

  users.getRequesters = function(task){
    return $http.get(proxy + '/requesters/'+ task._id).then(function(response){
      return response.data;
    });
 };

  users.acceptTask = function(id, accepter, assignedTo){
    return $http.post(proxy + '/accept', {"taskID": id, "accepter": accepter, "assignedTo": assignedTo}).then(function(response){
      return response.data;
    });
 };

  users.completeTask = function(task){
    return $http.post(proxy + '/completeTask', {"taskID": task._id, "completedBy": task.assignedTo}).then(function(response){
      return response.data;
    });
 };

  users.submitReview = function(review){
    return $http.post(proxy + '/submitReview', {"review": review}).then(function(response){
      return response.data;
    });
 };

  users.updateUser = function(username, updates){
    return $http.post(proxy + '/updateUser',{"username": username, "updates": updates});
 };

  users.requestTask = function(task, user){
    return $http.post(proxy + '/requestTask/' + task, {"requester": user}).then(function(response){
      return response.data;
    });
 };

  users.trust = function(trusted, trusting){
    return $http.post(proxy + '/trustUser', {"trusted": trusted, "trusting": trusting});
 };

  users.untrust = function(untrusted, untrusting){
    return $http.post(proxy + '/untrustUser', {"untrusted": untrusted, "untrusting": untrusting}).then(function(response){
      return response.data;
    });
 };

  return users;
})

.factory('Settings', function($http){
  var settings = {};

  settings.updateSettings = function(settings, username){
    return $http.post(proxy +'/updateSettings',{"settings": settings, "username": username}).then(function(response){
      return response.data;
    });
 };

  return settings;
});
