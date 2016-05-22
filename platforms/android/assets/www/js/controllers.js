angular.module('app.controllers', ['ngCordova', 'jrCrop'])

.directive('starRating', function () {
	return {
		restrict: 'A',
		template: "<span class='icon ion-ios-star fullRating' ng-repeat='star in stars'></span>" +
		"<span class='icon ion-ios-star-half fullRating' ng-repeat='half in halves'></span>" +
		"<span class='icon ion-ios-star-outline emptyRating' ng-repeat='empty in emptys'></span>" ,
		scope: {
			ratingValue: '=',
		},
		link: function (scope, elem, attrs) {
			var update = function(){
				scope.stars = [];
				scope.halves = [];
				scope.emptys = [];
				for (var i = 0; i < 5; i++) {
					if(i + 0.5 === scope.ratingValue){
						scope.halves.push(i);
					}else if(i < scope.ratingValue){
						scope.stars.push(i);
					}else{
						scope.emptys.push(i);
					}
				}
			};
			update();
			scope.$watch('ratingValue', function(){
				update();
			});
		}
	};
})

.directive('starRatingSmall', function () {
	return {
		restrict: 'A',
		template: "<span class='icon ion-ios-star smallRating' ng-repeat='star in stars'></span>" +
		"<span class='icon ion-ios-star-half smallRating' ng-repeat='half in halves'></span>" +
		"<span class='icon ion-ios-star-outline smallRating' ng-repeat='empty in emptys'></span>" ,
		scope: {
			ratingValue: '=',
		},
		link: function (scope, elem, attrs) {
			var update = function(){
				scope.stars = [];
				scope.halves = [];
				scope.emptys = [];
				for (var i = 0; i < 5; i++) {
					if(i + 0.5 === scope.ratingValue){
						scope.halves.push(i);
					}else if(i < scope.ratingValue){
						scope.stars.push(i);
					}else{
						scope.emptys.push(i);
					}
				}
			};
			update();
			scope.$watch('ratingValue', function(){
				update();
			});
		}
	};
})

.directive('starRatingDynamic', function () {
	return {
		restrict: 'A',
		template: "<span class='icon ion-ios-star fullRating' ng-repeat='star in stars' ng-click='show(star)'></span>" +
		"<span class='icon ion-ios-star-outline emptyRating' ng-repeat='empty in emptys' ng-click='show(empty)'></span>" ,
		scope: {
			ratingValue: '=',
		},
		link: function (scope, elem, attrs) {
			scope.show = function(value){
				scope.ratingValue = value + 1;
				scope.rating = value + 1;
				scope.stars = [];
				scope.emptys = [];
				for (var i = 0; i < 5; i++) {
					if(i < scope.ratingValue){
						scope.stars.push(i);
					}else{
						scope.emptys.push(i);
					}
				}
			};
			scope.stars = [];
			scope.emptys = [];
			for (var i = 0; i < 5; i++) {
				if(i < scope.ratingValue){
					scope.stars.push(i);
				}else{
					scope.emptys.push(i);
				}
			}
		}
	};
})

.directive('moneyRating', function () {
	return {
		restrict: 'A',
		template: "<span class='icon ion-social-usd moneyIcon' ng-repeat='sign in signs'></span>" +
		"<span class='icon ion-social-usd-outline moneyIcon' ng-repeat='emptySign in emptySigns'></span>",
		scope: {
			rating: '=',
		},
		link: function (scope, elem, attrs) {
			scope.signs = [];
			scope.emptySigns = [];
			for (var i = 0; i < 3; i++) {
				if(i < scope.rating){
					scope.signs.push(i);
				}else{
					scope.emptySigns.push(i);
				}
			}
		}
	};
})



















// Main Controller - wrapper controller for the whole app.
.controller('MainController', function($rootScope, $scope, AuthService){
	// Listen for new notifications and update the list when a new one comes along.
	$scope.$watch(function() {
		return $rootScope.notifications;
	}, function() {
		$scope.notifications = $rootScope.notifications;
	});

})





















// Controller for the screen that shows "login" or "Sign up"
// Basically a redirect controller
.controller('LandingController', function($scope, $state, $ionicPlatform){

	$scope.$on('$ionicView.loaded', function() {
		$ionicPlatform.ready( function() {
			setTimeout(function() {
				navigator.splashscreen.hide();
			}, 1000);
		});
	});

	$scope.signIn = function(){
		$state.go('login');
	};

	$scope.signUp = function(){
		$state.go('signup');
	};

})






















// Controller for the login screen, runs the AuthService service login functions.
.controller('LoginController', function($scope, $http, $state, $ionicLoading, AuthService){

	// Initiates the inputs as to avoid null comparison errors when submitting.
	$scope.login = {};

	// Run the login stuff.
	$scope.signIn = function(){
		if (!!$scope.login.username && !!$scope.login.password) {
			var username = $scope.login.username;
			var password = $scope.login.password;
			if(username === "" || password === ""){
				$ionicLoading.show({
					template: "Invalid Username or Password",
					duration: 2000
				});
			}else{
				AuthService.login(username.toLowerCase(),password);
				console.log("logging in");
			}
		}
		else{
			$ionicLoading.show({
				template: "Please enter a username and password",
				duration: 2000
			});
		}

	};
})





















// Controller for the sign up screen, Allows you to use the Users service to add your user.
.controller('SignUpController', function($scope, Users, $ionicLoading, $state, $ionicModal, $ionicPlatform, $cordovaCamera, $jrCrop){
	$scope.user = {};
	$scope.user.avatar = "img/blank.png";

	// Load in all the Users async so it can check weather or not the user already exists
	Users.getUsernames().then(function(usernames){
		$scope.usernames = [];
		$scope.emails = [];
		usernames.forEach(function(username){
			$scope.usernames.push(username.username);
			$scope.emails.push(username.email);
		});
	});

	$scope.signUp = function(){
		$scope.submitOnce = true;
		/* validate user fields
		1. check for first and last name (at least one character)
		2. check that the user has attached a profile pic
		3. check that a birthday has been entered and it is valid
		4. verify that the user has entered an email address and make sure one does not already exist in the system
		5. verify that the passwords are the same
		*/
		if(validated()){
			$ionicLoading.show();
			Users.createUser($scope.user).success(function(response){
				$ionicLoading.show({
					template: "Account Created. Please confirm your account using the email sent to " + $scope.user.email + " to login to MiddleMan.",
					duration: 4000
				});
				$scope.submitOnce = false;
				$state.go('login');
			})
			.error(function(){
				console.log('failed');
			});
		}else{
			$scope.submitOnce = false;
			return;
		}
	};

	// Scope function to upload a user photo.
	$scope.getPhoto = function(location){
		$ionicPlatform.ready(function(){
			$cordovaCamera.getPicture({
				destinationType: navigator.camera.DestinationType.FILE_URL,
				sourceType: navigator.camera.PictureSourceType[location],
				correctOrientation: true
			}).then(function(photo){
				$jrCrop.crop({
					url: photo,
					height: 200,
					width: 200,
					circle: true,
					title: 'Move and Scale'
				}).then(function(canvas) {
					$scope.user.avatar = canvas.toDataURL();
				}, function() {
					// User canceled or couldn't load image.
				});
			}, function(err){
				console.log(err);
			});
		});
	};

	// Hide the popup
	$scope.hideModal = function () {
		$scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});



	// Verify that all the data is valid/filled out.
	var validated = function(){
		var errors = true;
		if($scope.user.first){
			if($scope.user.first.length >= 1 && $scope.user.first.length <= 25){
				document.getElementById("first").setAttribute("class", "signUpCorrect");
				$scope.firstError = false;
			}else{
				document.getElementById("first").setAttribute("class", "signUpError");
				errors = false;
				$scope.firstError = true;
			}
		}else{
			document.getElementById("first").setAttribute("class", "signUpError");
			errors = false;
			$scope.firstError = true;
		}
		if($scope.user.last){
			if($scope.user.last.length >= 1 && $scope.user.last.length <= 25){
				document.getElementById("last").setAttribute("class", "signUpCorrect");
				$scope.lastError = false;
			}else{
				document.getElementById("last").setAttribute("class", "signUpError");
				errors = false;
				$scope.lastError = true;
			}
		}else{
			document.getElementById("last").setAttribute("class", "signUpError");
			errors = false;
			$scope.lastError = true;
		}
		if($scope.user.avatar){
			if($scope.user.avatar !== "img/blank.png"){
				document.getElementById("avatar").setAttribute("class", "signUpCorrect");
				$scope.avatarError = false;
			}else{
				document.getElementById("avatar").setAttribute("class", "signUpError");
				errors = false;
				$scope.avatarError = true;
			}
		}else{
			document.getElementById("avatar").setAttribute("class", "signUpError");
			errors = false;
			$scope.avatarError = true;
		}
		if($scope.user.birthday){
			if($scope.user.birthday <= new Date()){
				document.getElementById("birthday").setAttribute("class", "signUpCorrect");
				$scope.birthdayError = false;
			}else{
				document.getElementById("birthday").setAttribute("class", "signUpError");
				errors = false;
				$scope.birthdayError = true;
			}
		}else{
			document.getElementById("birthday").setAttribute("class", "signUpError");
			errors = false;
			$scope.birthdayError = true;
		}
		if($scope.user.username){
			if($scope.user.username.length > 0 && $scope.user.username.length <= 18 && $scope.user.username.split(" ").length === 1){
				document.getElementById("username").setAttribute("class", "signUpCorrect");
				$scope.usernameError = false;
			}else{
				document.getElementById("username").setAttribute("class", "signUpError");
				errors = false;
				$scope.usernameError = true;
			}
		}else{
			document.getElementById("username").setAttribute("class", "signUpError");
			errors = false;
			$scope.usernameError = true;
		}
		if($scope.user.email){
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(re.test($scope.user.email)){
				document.getElementById("email").setAttribute("class", "signUpCorrect");
				$scope.emailError = false;
			}else{
				document.getElementById("email").setAttribute("class", "signUpError");
				errors = false;
				$scope.emailError = true;
			}
		}else{
			document.getElementById("email").setAttribute("class", "signUpError");
			errors = false;
			$scope.emailError = true;
		}
		if($scope.usernames.indexOf($scope.user.username) !== -1){
			$scope.usernameTaken = true;
			document.getElementById("username").setAttribute("class", "signUpError");
			errors = false;
		}else{
			$scope.usernameTaken = false;
		}
		if($scope.emails.indexOf($scope.user.email) !== -1){
			$scope.emailTaken = true;
			document.getElementById("email").setAttribute("class", "signUpError");
			errors = false;
		}else{
			$scope.emailTaken = false;
		}
		if($scope.user.password){
			if($scope.user.password.length <= 6){
				document.getElementById("pass").setAttribute("class", "signUpError");
				$scope.passwordError = true;
				errors = false;
			}else{
				document.getElementById("pass").setAttribute("class", "signUpCorrect");
				$scope.passwordError = false;
			}
		}else{
			document.getElementById("pass").setAttribute("class", "signUpError");
			$scope.passwordError = true;
			errors = false;
		}
		if($scope.user.confirmedPassword){
			if($scope.user.confirmedPassword === $scope.user.password){
				document.getElementById("passCon").setAttribute("class", "signUpCorrect");
				$scope.conPassError = false;
			}else{
				document.getElementById("passCon").setAttribute("class", "signUpError");
				$scope.conPassError = true;
				errors = false;
			}
		}else{
			document.getElementById("passCon").setAttribute("class", "signUpError");
			$scope.conPassError = true;
			errors = false;
		}
		return errors;
	};






})





















// Controller for the map screen
.controller('HomeController', function($scope, $http, $state, $ionicLoading, JobLocations, $rootScope, $cordovaGeolocation, $ionicPlatform){

	// Hide the splash screen if this tab is loaded first.

	$scope.$on('$ionicView.loaded', function() {
		$ionicPlatform.ready( function() {
			setTimeout(function() {
				navigator.splashscreen.hide();
			}, 1000);
		});
	});

	$scope.infoWindow = {};
	var map;
	document.addEventListener("deviceready", function() {


		$cordovaGeolocation.getCurrentPosition().then(function(pos) {


			yourLat = pos.coords.latitude;
			yourLng = pos.coords.longitude;


			var div = document.getElementById("map");

			var myLatlng = new plugin.google.maps.LatLng(yourLat, yourLng);

			var mapOptions = {
				'mapType': plugin.google.maps.MapTypeId.ROADMAP,
				'camera': {
					'latLng': myLatlng,
					'zoom': 10
				}
			};

			// Initialize the map view
			map = plugin.google.maps.Map.getMap(div, mapOptions);

			// Wait until the map is ready status.
			map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

			$scope.map = map;


			var imageLoc = "img/yourLoc.png";
			var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

			var yourLocation = new plugin.google.maps.LatLng(yourLat, yourLng);
			map.addMarker({
				'position': yourLocation,
				'title': "You!",
				'snippet': "",
				'taskID': "task._id",
				'styles' : {
					'text-align': 'center',
					'font-weight': 'bold',
					'color': '#8BC34A'
				}
			});


		});



	}, false);

	function onMapReady() {
		JobLocations.getTasks(window.localStorage.getItem("USER")).then(function(tasks){
			tasks.forEach(function(task){
				if(typeof task.assignedTo === 'undefined' && (task.expires === 'Until Completed' || parseInt(task.expires) > new Date())){
					createMarker(task);
				}
			});
		});
	}

	var createMarker = function(task){
		var latlng = new plugin.google.maps.LatLng(task.lat, task.lng);
		map.addMarker({
			'position': latlng,
			'title': task.title + " - $" + task.pay,
			'snippet': task.estimatedTime + "\n" + "Tap for details!",
			'taskID': task._id,
			'styles' : {
				'text-align': 'center',
				'font-weight': 'bold',
				'color': '#8BC34A'
			}
		}, function(marker) {
			marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
				$state.go('tabs.taskDetailH',{"taskID": marker.get("taskID")});
			});

		});
	};

	$scope.refresh = function(){
		JobLocations.getTasks(window.localStorage.getItem("USER")).then(function(tasks){
			$scope.map.clear();
			tasks.forEach(function(task){
				if(typeof task.assignedTo === 'undefined' && (task.expires === 'Until Completed' || parseInt(task.expires) > new Date())){
					createMarker(task);
				}
			});
		});
	};
})


















.controller('HelpController', function($scope){

})






















.controller('SettingsController', function($scope, Settings, AuthService){

	$scope.settings = {};

	$scope.$watch('settings', function(){
		if(typeof $scope.settings.favorFeed !== 'undefined'){
			Settings.updateSettings($scope.settings, $scope.loggedIn.username);
		}
	}, true);

	$scope.$on('$ionicView.beforeEnter', function(){
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			$scope.settings = currentUser.settings;
		});
	});

})






















.controller('AskFavorController', function($ionicModal, $state, $scope, $http, JobLocations, $ionicLoading, AuthService, $cordovaCamera, $jrCrop, $ionicPlatform, $cordovaSocialSharing){
	$scope.task = {};
	var autocomplete;

	$scope.$on('$ionicView.loaded', function() {
		$ionicPlatform.ready( function() {
			setTimeout(function() {
				navigator.splashscreen.hide();
			}, 1000);
		});
	});

	$scope.$on('$ionicView.afterEnter', function(){
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
		});
		autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),{types: ['geocode']});
		google.maps.event.addListener(autocomplete, 'place_changed', function(){
			var place = autocomplete.getPlace();
			$scope.task.address = place.formatted_address;
			$scope.task.lat = place.geometry.location.lat();
			$scope.task.lng = place.geometry.location.lng();
			$scope.$apply();
		});
	});

	$scope.getPhoto = function(location){
		$ionicPlatform.ready(function(){
			$cordovaCamera.getPicture({
				destinationType: navigator.camera.DestinationType.FILE_URL,
				sourceType: navigator.camera.PictureSourceType[location],
				correctOrientation: true
			}).then(function(photo){
				$jrCrop.crop({
					url: photo,
					height: 200,
					width: 200,
					title: 'Move and Scale'
				}).then(function(canvas) {
					$scope.task.image = canvas.toDataURL();
				}, function() {
					// User canceled or couldn't load image.
				});
			}, function(err){
				console.log(err);
			});
		});
	};

	$scope.disableTap = function(){
		container = document.getElementsByClassName('pac-container');
		angular.element(container).attr('data-tap-disabled', 'true');
		angular.element(container).on("click", function(){
			document.getElementById('autocomplete').blur();
		});
	};

	$scope.geolocate = function(){
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				autocomplete.setBounds(circle.getBounds());
			});
		}
	};

	$scope.share = function(){
		var link = "";
		if(device.platform == "Android"){
			link = 'http://play.google.com/store/apps/details?id=com.ionicframework.middleman808369';
		}
		$cordovaSocialSharing.share($scope.task.title, $scope.task.description, null, link);
		if($scope.loggedIn.settings.general.easyMode){
			$state.go('easy.favorFeed');
		}else{
			$state.go('tabs.favorFeed');
		}
	};

	$scope.socialShare = function(){
		$ionicModal.fromTemplateUrl('views/ask-favor/share.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.hideModal = function () {
		$scope.modal.hide();
		if($scope.loggedIn.settings.general.easyMode){
			$state.go('easy.favorFeed');
		}else{
			$state.go('tabs.favorFeed');
		}
	};

	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.add = function(){
		$scope.submitOnce = true;
		$scope.task.postedBy = $scope.loggedIn.username;
		$scope.task.timePosted = new Date().getTime();

		if($scope.task.expiresTemp !== "Until Completed"){
			$scope.task.expires = parseInt($scope.task.expiresTemp) * 1000*60*60*24 + $scope.task.timePosted;
		}else{
			$scope.task.expires = $scope.task.expiresTemp;
		}

		if(validated()){
			$scope.submitOnce = false;
			JobLocations.addTask($scope.task).success(function(){
				$ionicLoading.show({
					template: "Favor Posted",
					duration: 2000
				});
				$scope.task = {};
				$scope.socialShare();
			})
			.error(function(){
				$ionicLoading.show({
					template: "Error Posting Favor",
					duration: 2000
				});
			});
			$scope.submitOnce = false;
		}else{
			$scope.submitOnce = false;
		}
	};

	var validated = function(){
		var errors = true;
		if($scope.task.category){
			document.getElementById("category").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.catError = false;
		}else{
			document.getElementById("category").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.catError = true;
		}
		if($scope.task.title){
			if($scope.task.title.length > 0 && $scope.task.title.length <= 18){
				document.getElementById("title").setAttribute("class", "item item-input signUpCorrect");
				$scope.titleError = false;
			}else{
				document.getElementById("title").setAttribute("class", "item item-input signUpError");
				$scope.titleError = true;
				errors = false;
			}
		}else{
			document.getElementById("title").setAttribute("class", "item item-input signUpError");
			$scope.titleError = true;
			errors = false;
		}
		if($scope.task.description){
			if($scope.task.description.length > 0 && $scope.task.description.length <= 180){
				document.getElementById("description").setAttribute("class", "item item-input signUpCorrect");
				$scope.descriptionError = false;
			}else{
				document.getElementById("description").setAttribute("class", "item item-input signUpError");
				$scope.descriptionError = true;
				errors = false;
			}
		}else{
			document.getElementById("description").setAttribute("class", "item item-input signUpError");
			$scope.descriptionError = true;
			errors = false;
		}
		document.getElementById("image").setAttribute("class", "item signUpCorrect");
		if($scope.task.estimatedTime){
			document.getElementById("estimatedTime").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.timeError = false;
		}else{
			document.getElementById("estimatedTime").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.timeError = true;
		}
		if($scope.task.pay){
			var regex = /(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
			if(regex.test($scope.task.pay) && !isNaN(parseFloat($scope.task.pay)) && $scope.task.pay > 0){
				document.getElementById("pay").setAttribute("class", "item item-input signUpCorrect");
				$scope.payError = false;
			}else{
				document.getElementById("pay").setAttribute("class", "item item-input signUpError");
				$scope.payError = true;
				errors = false;
			}
		}else{
			document.getElementById("pay").setAttribute("class", "item item-input signUpError");
			$scope.payError = true;
			errors = false;
		}
		if($scope.task.lat){
			var addressElements = $scope.task.address.split(", ");
			if(addressElements.length >= 3){
				document.getElementById("address").setAttribute("class", "item item-input item-select signUpCorrect");
				$scope.addressError = false;
			}else{
				document.getElementById("address").setAttribute("class", "item item-input item-select signUpError");
				errors = false;
				$scope.addressError = true;
			}
		}else{
			document.getElementById("address").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.addressError = true;
		}
		if($scope.task.viewedBy){
			document.getElementById("viewedBy").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.viewError = false;
		}else{
			document.getElementById("viewedBy").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.viewError = true;
		}
		if($scope.task.expires){
			document.getElementById("expires").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.expiresError = false;
		}else{
			document.getElementById("expires").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.expiresError = true;
		}
		return errors;
	};

	$scope.$watch('task.pay', function(newValue, oldValue){
		var regex = /(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
		if($scope.task.pay){
			var pay = $scope.task.pay.replace(/[^0-9|\.]/,"");
			var parts = pay.split(".");
			if(parts.length > 1){
				var afterDecimal = parts[1].split("");
				if(afterDecimal.length === 1){
					$scope.task.pay = parts[0] + "." + afterDecimal[0];
				}else if(afterDecimal.length > 1){
					$scope.task.pay = parts[0] + "." + afterDecimal[0] + afterDecimal[1];
				}else{
					$scope.task.pay = pay;
				}
			}else{
				$scope.task.pay = pay;
			}
		}
	});
})






















.controller('FavorFeedController', function($scope, JobLocations, Users, $state, AuthService, $cordovaSocialSharing){

	$scope.allTasks = [];
	$scope.tasks = [];

	$scope.selectOptions1 = [{
		option: "Posted By",
		value: "postedBy"
	},{
		option: "Rating",
		value: "rating"
	},{
		option: "Distance From Me",
		value: "distance"
	},{
		option: "Category",
		value: "category"
	},{
		option: "Pay",
		value: "pay"
	},{
		option: "Estimated Time",
		value: "estimatedTime"
	}];

	$scope.share = function(task){
		var link = "";
		if(device.platform == "Android"){
			link = 'http://play.google.com/store/apps/details?id=com.ionicframework.middleman808369';
		}
		$cordovaSocialSharing.share(task.title, task.description, "www/img/title-bar-2.png", link);
	};

	$scope.shareViaTwitter = function(task) {
		var link = "";
		if(device.platform == "Android"){
			link = 'http://play.google.com/store/apps/details?id=com.ionicframework.middleman808369';
		}
		$cordovaSocialSharing.canShareVia("twitter", task.description, null, link).then(function(result) {
			$cordovaSocialSharing.shareViaTwitter(task.description, null, link);
		}, function(error) {
			console.log(error);
			alert("Cannot share on Twitter");
		});
	};

	var distance = function(lat1, lon1, lat2, lon2) {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var radlon1 = Math.PI * lon1/180;
		var radlon2 = Math.PI * lon2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	};

	$scope.load = function(){
		var currentUser = window.localStorage.getItem("USER");
		JobLocations.getTasks(currentUser).then(function(tasks){
			var results = [];
			var filtered = [];
			var taskCount = 0;
			tasks.forEach(function(task){
				if(typeof task.assignedTo === 'undefined' && (task.expires === 'Until Completed' || parseInt(task.expires) > new Date())){
					filtered.push(task);
				}
			});
			filtered.forEach(function(task){
				switch(task.category){
					case "Labor":
					task.icon = "img/labor-icon.png";
					break;
					case "Yard Work":
					task.icon = "img/yardWork-icon.png";
					break;
					case "Pet Care":
					task.icon = "img/petCare-icon.png";
					break;
					case "House Work":
					task.icon = "img/houseWork-icon.png";
					break;
					case "Delivery":
					task.icon = "img/delivery-icon.png";
					break;
					case "Moving":
					task.icon = "img/moving-icon.png";
					break;
				}
				task = setTimeSincePost(task);
				task = setExpiresIn(task);
				Users.getUser(task.postedBy).then(function(user){
					task.user = user;
					if(task.viewedBy === "Only those I trust"){
						if(task.user.trusts.indexOf(currentUser) !== -1 || task.user.username === currentUser){
							results.push(task);
						}
					}else{
						results.push(task);
					}
					taskCount += 1;
					if(taskCount === filtered.length){
						results.sort(function(a,b){
							return b.timePosted - a.timePosted;
						});
						$scope.tasks = results;
						navigator.geolocation.getCurrentPosition(function(position){
							var lat = position.coords.latitude;
							var lng = position.coords.longitude;
							$scope.tasks.forEach(function(task){
								task.distance = distance(lat, lng, task.lat, task.lng);
							});
						});
						$scope.tasks.forEach(function(task){
							var taskCopy = copy(task);
							$scope.allTasks.push(task);
						});
					}
				});
			});
		}).finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	var setTimeSincePost = function(task){
		var time = new Date().getTime() - task.timePosted;
		if(Math.floor(time/(1000*60*60*24)) > 0){
			time = Math.floor(time/(1000*60*60*24));
			task.timeSincePosted = time + "d";
		}else if(Math.floor(time/(1000*60*60))){
			time = Math.floor(time/(1000*60*60));
			task.timeSincePosted = time + "h";
		}else{
			time = Math.floor(time/(1000*60));
			task.timeSincePosted = time + "m";
		}
		return task;
	};

	var setExpiresIn = function(task){
		if(task.expires !== "Until Completed"){
			task.expiresDate = new Date(parseInt(task.expires));
			return task;
		}else{
			task.expiresDate = "Completed";
			return task;
		}
	};

	$scope.load();

	$scope.selectOptions2 = [];
	$scope.selectOptions3 = [];

	$scope.searched = false;
	$scope.category = false;
	$scope.search = {};

	$scope.openSearch = function(){
		$scope.searched = !$scope.searched;
		$scope.select1 = true;
	};

	$scope.clearSearch = function(){
		$scope.select2 = false;
		$scope.select3 = false;
		$scope.selectOptions2 = [];
		$scope.selectOptions3 = [];
		$scope.search = {};
		$scope.tasks = $scope.allTasks;
		$scope.searched = !$scope.searched;
	};

	$scope.addFilter = function(){
		if($scope.select2){
			if($scope.search.condition2){
				$scope.select3 = true;
				document.getElementById("select2").disabled = true;
				$scope.selectOptions2.forEach(function(option){
					if(option.value !== $scope.search.condition2.value){
						$scope.selectOptions3.push(option);
					}
				});
			}
		}else{
			if($scope.search.condition1){
				$scope.select2 = true;
				document.getElementById("select1").disabled = true;
				$scope.selectOptions1.forEach(function(option){
					if(option.value !== $scope.search.condition1.value){
						$scope.selectOptions2.push(option);
					}
				});
			}
		}
	};

	$scope.$watch('search.term1', function(){
		$scope.tasks = returnResults();
	});

	$scope.$watch('search.term2', function(){
		$scope.tasks = returnResults();
	});

	$scope.$watch('search.term3', function(){
		$scope.tasks = returnResults();
	});

	$scope.$watch('search.condition1.value', function(){
		$scope.search.term1 = undefined;
	});

	$scope.$watch('search.condition2.value', function(){
		$scope.search.term2 = undefined;
	});

	$scope.$watch('search.condition2.value', function(){
		$scope.search.term3 = undefined;
	});

	var returnResults = function(){
		var results = $scope.allTasks;
		var results1 = [];
		var results2 = [];
		var results3 = [];
		if(typeof $scope.search.term1 !== "undefined"){
			results.forEach(function(task){
				if($scope.search.condition1.value !== 'distance' && $scope.search.condition1.value !== 'pay'){
					if(task[$scope.search.condition1.value].toLowerCase().indexOf($scope.search.term1.toLowerCase()) === 0){
						results1.push(task);
					}
				}else if($scope.search.condition1.value === 'distance'){
					if(task[$scope.search.condition1.value] <= $scope.search.term1 || $scope.search.term1 === ""){
						results1.push(task);
					}
				}else if($scope.search.condition1.value === 'pay'){
					if(task[$scope.search.condition1.value] >= $scope.search.term1){
						results1.push(task);
					}
				}
			});
			results = results1;
		}
		if(typeof $scope.search.term2 !== "undefined"){
			results.forEach(function(task){
				if($scope.search.condition2.value !== 'distance' && $scope.search.condition2.value !== 'pay'){
					if(task[$scope.search.condition2.value].toLowerCase().indexOf($scope.search.term2.toLowerCase()) === 0){
						results2.push(task);
					}
				}else if($scope.search.condition2.value === 'distance'){
					if(task[$scope.search.condition2.value] <= $scope.search.term2 || $scope.search.term2 === ""){
						results2.push(task);
					}
				}else if($scope.search.condition2.value === 'pay'){
					if(task[$scope.search.condition2.value] >= $scope.search.term2){
						results2.push(task);
					}
				}
			});
			results = results2;
		}
		if(typeof $scope.search.term3 !== "undefined"){
			results.forEach(function(task){
				if($scope.search.condition3.value !== 'distance' && $scope.search.condition3.value !== 'pay'){
					if(task[$scope.search.condition3.value].toLowerCase().indexOf($scope.search.term3.toLowerCase()) === 0){
						results3.push(task);
					}
				}else if($scope.search.condition3.value === 'distance'){
					if(task[$scope.search.condition3.value] <= $scope.search.term3 || $scope.search.term3 === ""){
						results3.push(task);
					}
				}else if($scope.search.condition3.value === 'pay'){
					if(task[$scope.search.condition3.value] >= $scope.search.term3){
						results3.push(task);
					}
				}
			});
			results = results3;
		}
		return results;
	};

	$scope.removeFilter = function(){
		if($scope.select3){
			$scope.select3 = false;
			document.getElementById("select2").disabled = false;
			$scope.search.term3 = undefined;
			$scope.search.condition3 = undefined;
			$scope.selectOptions3 = [];
		}else{
			$scope.select2 = false;
			document.getElementById("select1").disabled = false;
			$scope.search.term2 = undefined;
			$scope.search.condition2 = undefined;
			$scope.selectOptions2 = [];
		}
	};

	var copy = function(obj){
		var result = {};
		for(var p in obj){
			if(obj.hasOwnProperty(p)){
				result[p] = obj[p];
			}
		}
		return result;
	};
})






















.controller('SearchController', function($scope, Users){
	$scope.search = {};
	$scope.users = [];

	$scope.$on('$ionicView.beforeEnter', function(){
		Users.getUsers().then(function(users){
			$scope.users = users;
		});
	});

	$scope.$watch('search.term', function(){
		if(typeof $scope.search.term !== 'undefined'){
			$scope.results = returnResults($scope.search.term.toLowerCase(), $scope.search.condition);
		}
	});

	var returnResults = function(term, condition){
		var results = [];
		if($scope.users.length === 0){
			return results;
		}
		if(term === ""){
			return results;
		}
		switch(condition){
			case 'username':
			$scope.users.forEach(function(user){
				if(user.username.toLowerCase().indexOf(term) === 0){
					results.push(user);
				}
			});
			return results;
			case 'rating':
			$scope.users.forEach(function(user){
				if(typeof user.ratings !== 'undefined'){
					if(user.ratings.overall.value >= term){
						results.push(user);
					}
				}
			});
			return results;
			default:
			console.log('other');
		}
	};
})






















.controller('ProfileController', function($scope, $stateParams, Users, $state, AuthService){

	$scope.rating = 0;
	$scope.yardWorkRating = 0;
	$scope.laborRating = 0;
	$scope.petCareRating = 0;
	$scope.houseWorkRating = 0;
	$scope.deliveryRating = 0;
	$scope.movingRating = 0;
	$scope.showing = 'profile';

	$scope.trustButton = function(){
		if($scope.trusted){
			return "Trusted";
		}else{
			return "Trust";
		}
	};

	var setExpiresIn = function(task){
		if(typeof task.expires === 'undefined'){
			task.expiresDate = 0;
			return task;
		}
		if(task.expires !== "Until Completed"){
			task.expiresDate = new Date(parseInt(task.expires));
			return task;
		}else{
			task.expiresDate = "Completed";
			return task;
		}
	};

	$scope.expiredTask = function(task){
		if(task.expiresDate === "Completed"){
			return false;
		}else{
			if(task.expiresDate < new Date()){
				return true;
			}else{
				return false;
			}
		}
	};

	$scope.setTab = function(tab){
		$scope.showing = tab;
	};

	$scope.showingTab = function(tab){
		return tab === $scope.showing;
	};

	$scope.taskDetail = function(task){
		if(task.expiresDate < new Date()){
			return;
		}else{
			$state.go('taskDetail', {taskID: task._id});
		}
	};

	$scope.trust = function(user){
		//  Trust or untrust user
		if($scope.trusted){
			//Untrust
			Users.untrust(user.username, $scope.loggedIn.username).then(function(response){
				var index = $scope.user.trustedBy.indexOf($scope.loggedIn.username);
				$scope.user.trustedBy.splice(index, 1);
				$scope.trusted = false;
			});
		}else{
			//Trust
			Users.trust(user.username, $scope.loggedIn.username).success(function(){
				$scope.user.trustedBy.push($scope.loggedIn.username);
				$scope.trusted = true;
			});
		}
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.openTasks = [];
		$scope.reviews = [];
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			if($stateParams.user){
				Users.getUser($stateParams.user).then(function(user){
					$scope.user = user;
					$scope.rating = $scope.user.ratings.overall.value;
					$scope.yardWorkRating = $scope.user.ratings.yardWork.value || 0;
					$scope.laborRating = $scope.user.ratings.labor.value || 0;
					$scope.petCareRating = $scope.user.ratings.petCare.value || 0;
					$scope.houseWorkRating = $scope.user.ratings.houseWork.value || 0;
					$scope.deliveryRating = $scope.user.ratings.delivery.value || 0;
					$scope.movingRating = $scope.user.ratings.moving.value || 0;
					$scope.user.reviews.forEach(function(review){
						if(review.displayed){
							$scope.reviews.push(review);
						}
					});
					if($scope.loggedIn.trusts.indexOf($scope.user.username) !== -1){
						$scope.trusted = true;
					}
					$scope.user.tasks.sort(function(a,b){
						return b.timePosted - a.timePosted;
					});
					$scope.user.tasks.forEach(function(task){
						if(typeof task.assignedTo === 'undefined'){
							if(task.viewedBy === "Only Those I Trust"){
								if($scope.user.trusts.indexOf($scope.loggedIn.username) !== -1 || $scope.loggedIn.username === $scope.user.username){
									task = setExpiresIn(task);
									$scope.openTasks.push(task);
								}
							}else{
								task = setExpiresIn(task);
								$scope.openTasks.push(task);
							}
						}
					});
				});
			}else{
				$state.go('home');
			}
		});
	});

})





















.controller('MyProfileController', function($scope, $stateParams, $state, $ionicModal, $ionicLoading, AuthService, $ionicPlatform, $cordovaCamera, $cordovaFileTransfer, Users, $jrCrop, $ionicSideMenuDelegate, JobLocations){

	$scope.rating = 0;
	$scope.yardWorkRating = 0;
	$scope.laborRating = 0;
	$scope.petCareRating = 0;
	$scope.houseWorkRating = 0;
	$scope.deliveryRating = 0;
	$scope.movingRating = 0;
	$scope.showing = 'profile';
	$scope.temp = {};
	$scope.reorder = false;

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.openRequests = [];
		$scope.acceptedRequests = [];
		$scope.closedRequests = [];
		$scope.expiredRequests = [];
		closedRequests = [];
		expiredRequests = [];
		$scope.favors = [];
		$scope.paid = [];
		$scope.tasks = [];
		$scope.expiredTasks = [];
		$scope.reviews = [];
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;

			// All the ratings
			$scope.rating = $scope.loggedIn.ratings.overall.value || 0;
			$scope.yardWorkRating = $scope.loggedIn.ratings.yardWork.value || 0;
			$scope.laborRating = $scope.loggedIn.ratings.labor.value || 0;
			$scope.petCareRating = $scope.loggedIn.ratings.petCare.value || 0;
			$scope.houseWorkRating = $scope.loggedIn.ratings.houseWork.value || 0;
			$scope.deliveryRating = $scope.loggedIn.ratings.delivery.value || 0;
			$scope.movingRating = $scope.loggedIn.ratings.moving.value || 0;

			//
			$scope.favors = $scope.loggedIn.tasks;

			// Gets all reviews and puts them in an array to use.
			$scope.loggedIn.reviews.forEach(function(review){
				if(review.displayed){
					$scope.reviews.push(review);
				}
			});
			$scope.loggedIn.requests.sort(function(a,b){
				return b.timePosted - a.timePosted;
			});
			$scope.loggedIn.requests.forEach(function(request){
				request = setExpiresIn(request);
				if(typeof request.assignedTo !== 'undefined'){
					if(request.assignedTo === $scope.loggedIn.username){
						var newMessages = 0;
						request.messages.forEach(function(message){
							if(message.readByReceiver == 'false'){
								if(message.sender !== $scope.loggedIn.username){
									newMessages += 1;
								}
							}
						});
						request.newMessages = newMessages;
						$scope.acceptedRequests.push(request);
					}else{
						closedRequests.push(request);
					}
				}else{
					if(request.expiresDate === "Completed"){
						$scope.openRequests.push(request);
					}else{
						if(request.expiresDate < new Date()){
							expiredRequests.push(request);
						}else{
							$scope.openRequests.push(request);
						}
					}
				}
			});


			// Settings to show show closed and expired tasks in my profile
			if($scope.loggedIn.settings.myProfile.closed){
				$scope.closedRequests = closedRequests;
			}
			if($scope.loggedIn.settings.myProfile.expired){
				$scope.expiredRequests = expiredRequests;
			}
			$scope.loggedIn.tasks.sort(function(a,b){
				return b.timePosted - a.timePosted;
			});
			$scope.loggedIn.tasks.forEach(function(task){
				task = setExpiresIn(task);
				if(task.paidFor){
					$scope.paid.push(task);
				}else{
					if(typeof task.assignedTo === 'undefined' && task.expiresDate < new Date()){
						$scope.expiredTasks.push(task);
					}else{
						var newMessages = 0;
						task.messages.forEach(function(message){
							if(message.readByReceiver == 'false'){
								if(message.sender !== $scope.loggedIn.username){
									newMessages += 1;
								}
							}
						});
						task.newMessages = newMessages;
						$scope.tasks.push(task);
					}
				}
			});


		});
	});

	var setExpiresIn = function(task){
		if(typeof task.expires === 'undefined'){
			task.expiresDate = 0;
			return task;
		}
		if(task.expires !== "Until Completed"){
			task.expiresDate = new Date(parseInt(task.expires));
			return task;
		}else{
			task.expiresDate = "Completed";
			return task;
		}
	};

	$scope.completedButton = function(request){
		if(typeof request.completedBy === 'undefined'){
			return "Mark As Complete";
		}else{
			if(request.paidFor){
				return request.postedBy + " Paid You!";
			}else{
				return "Completed";
			}
		}
	};

	$scope.taskAssigned = function(task){
		return typeof task.assignedTo !== 'undefined';
	};

	$scope.setTab = function(tab){
		$scope.showing = tab;
	};

	$scope.showingTab = function(tab){
		return tab === $scope.showing;
	};

	$scope.taskAccepted = function(task){
		if(typeof task.assignedTo !== 'undefined'){
			return true;
		}else{
			return false;
		}
	};

	$scope.completed = function(task){
		if(typeof task.completedBy !== 'undefined'){
			return true;
		}else{
			return false;
		}
	};

	$scope.taskCompleted = function(task){
		if(typeof task.completedBy === 'undefined'){
			Users.completeTask(task).then(function(response){
				task.completedBy = task.assignedTo;
			});
		}
	};

})























.controller('TaskDetailController', function($scope, $stateParams, JobLocations, Users, $state, AuthService, $cordovaGeolocation){

	var yourLat, yourLng;
	$scope.overallRating = 0;

	$scope.requestTask = function(task){
		if(!$scope.requested){
			Users.requestTask(task._id, $scope.loggedIn.username).then(function(response){
				$scope.requested = true;
			});
		}
	};

	$scope.requestButton = function(){
		if($scope.requested){
			return "Requested";
		}else{
			return "Request This Favor!";
		}
	};

	$scope.laborIcon = function(task){
		if(typeof task !== 'undefined'){
			switch(task.category){
				case "Labor":
				return "img/labor-icon.png";
				case "Yard Work":
				return "img/yardWork-icon.png";
				case "Pet Care":
				return "img/petCare-icon.png";
				case "House Work":
				return "img/houseWork-icon.png";
				case "Delivery":
				return "img/delivery-icon.png";
				case "Moving":
				return "img/moving-icon.png";
			}
		}
	};

	var distance = function(lat1, lon1, lat2, lon2) {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var radlon1 = Math.PI * lon1/180;
		var radlon2 = Math.PI * lon2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			JobLocations.getTask($stateParams.taskID).then(function(task){
				$scope.task = setExpiresIn(task);
				Users.getUser($scope.task.postedBy).then(function(user){
					$scope.user = user;
					$scope.overallRating = $scope.user.ratings.overall.value || 0;
				});
				task.street = task.address.split(",")[0];
				task.city = task.address.split(",")[1] + ", " + task.address.split(",")[2];
				var time = new Date().getTime() - task.timePosted;
				if(Math.floor(time/(1000*60*60*24)) > 0){
					time = Math.floor(time/(1000*60*60*24));
					$scope.task.timeSincePosted = time + "d";
				}else if(Math.floor(time/(1000*60*60))){
					time = Math.floor(time/(1000*60*60));
					$scope.task.timeSincePosted = time + "h";
				}else{
					time = Math.floor(time/(1000*60));
					$scope.task.timeSincePosted = time + "m";
				}
				if($scope.task.requestedBy.indexOf($scope.loggedIn.username) !== -1){
					$scope.requested = true;
				}
				if(typeof yourLat === 'undefined'){
					$cordovaGeolocation.getCurrentPosition().then(function(pos) {
						yourLat = pos.coords.latitude;
						yourLng = pos.coords.longitude;
						$scope.task.distance = distance(task.lat, task.lng, yourLat, yourLng);
					});
				}else{
					$scope.task.distance = distance(task.lat, task.lng, yourLat, yourLng);
				}
			});
		});
	});

	var setExpiresIn = function(task){
		if(task.expires !== "Until Completed"){
			task.expiresDate = new Date(parseInt(task.expires));
			return task;
		}else{
			task.expiresDate = "Completed";
			return task;
		}
	};
})






















.controller('TrustedByController', function($scope, $state, Users, $stateParams, $rootScope, AuthService){

	$scope.trust = function(user){
		Users.trust(user.username, $scope.loggedIn.username).success(function(){
			user.trusted = true;
		});
	};

	$scope.untrust = function(user){
		Users.untrust(user.username, $scope.loggedIn.username).then(function(response){
			user.trusted = false;
		});
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.trustedByUsers = [];
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			if($stateParams.user){
				Users.getTrustedBy($stateParams.user).then(function(trustedBy){
					trustedBy.forEach(function(user){
						if($scope.loggedIn.trusts.indexOf(user.username) !== -1){
							user.trusted = true;
						}
						$scope.trustedByUsers.push(user);
					});
				});
			}else{
				$state.go('home');
			}
		});
	});
})























.controller('TrustsController', function($scope, $state, Users, $stateParams, AuthService){

	$scope.trust = function(user){
		Users.trust(user.username, $scope.loggedIn.username).success(function(){
			user.trusted = true;
		});
	};

	$scope.untrust = function(user){
		Users.untrust(user.username, $scope.loggedIn.username).then(function(response){
			user.trusted = false;
		});
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.trustsUsers = [];
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			if($stateParams.user){
				Users.getTrusts($stateParams.user).then(function(trusts){
					trusts.forEach(function(user){
						if($scope.loggedIn.trusts.indexOf(user.username) !== -1){
							user.trusted = true;
						}
						$scope.trustsUsers.push(user);
					});
				});
			}else{
				$state.go('home');
			}
		});
	});
})

























.controller('RequestersController', function($scope, Users, $stateParams, AuthService, JobLocations){

	$scope.accept = function(user){
		Users.acceptTask($scope.task._id, $scope.loggedIn.username, user.username).then(function(response){
			$scope.task.assignedTo = user.username;
			user.accepted = true;
		});
	};

	$scope.notAccepted = function(){
		if(typeof $scope.task.assignedTo === 'undefined'){
			return true;
		}else{
			return false;
		}
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.requesters = [];
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			if($stateParams.taskID){
				JobLocations.getTask($stateParams.taskID).then(function(task){
					$scope.task = task;
					Users.getRequesters(task).then(function(requesters){
						if(typeof task.assignedTo !== 'undefined'){
							requesters.forEach(function(requester){
								if(task.assignedTo === requester.username){
									requester.accepted = true;
								}else{
									requester.accepted = false;
								}
							});
						}
						$scope.requesters = requesters;
					});
				});
			}else{
				$state.go('home');
			}
		});
	});
})
























.controller('PayController', function($scope, $stateParams, JobLocations, Users, $ionicLoading, $state, AuthService){

	$scope.review = {};
	$scope.terms = {};

	$scope.$on('$ionicView.beforeEnter', function(){
		$ionicLoading.show();
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
		});
		JobLocations.getTask($stateParams.taskID).then(function(task){
			$scope.task = task;
			// Need to store the MiddleMan charge value in database
			$scope.task.charge = ((task.pay + 0.30 + 0.25 + 1) / (1 - 0.029)) - task.pay;
			var total = $scope.task.pay + $scope.task.charge;
			total = parseFloat(total.toFixed(2));
			$scope.task.total = total;
			$scope.review.user = task.completedBy;
			$scope.review.category = task.category;
			$scope.review.taskID = task._id;
			$ionicLoading.hide();
		});
	});

	var validated = function(){
		errors = true;
		if($scope.review.review){
			if($scope.review.review.length >= 1 && $scope.review.review.length <= 180){
				document.getElementById("review").setAttribute("class", "item item-input withBorder signUpCorrect");
				$scope.reviewError = false;
			}else{
				document.getElementById("review").setAttribute("class", "item item-input withBorder signUpError");
				$scope.reviewError = true;
				errors = false;
			}
		}else{
			document.getElementById("review").setAttribute("class", "item item-input withBorder signUpError");
			$scope.reviewError = true;
			errors = false;
		}
		if($scope.review.rating){
			document.getElementById("rating").setAttribute("class", "item item-input signUpCorrect");
			$scope.ratingError = false;
		}else{
			document.getElementById("rating").setAttribute("class", "item item-input signUpError");
			$scope.ratingError = true;
			errors = false;
		}
		if($scope.terms.accepted){
			document.getElementById("accepted").setAttribute("class", "item item-input signUpCorrect");
			$scope.acceptedError = false;
		}else{
			document.getElementById("accepted").setAttribute("class", "item item-input signUpError");
			$scope.acceptedError = true;
			errors = false;
		}
		$scope.$apply();
		return errors;
	};

	var initPaymentUI = function() {
		var clientIDs = {
			"PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
			"PayPalEnvironmentSandbox": "AdctG1K9sp5XhwoTceUzt2Phe3YKg9zn2Ra5pdd1Lc0Db_7E0VsX6lGww2zNtCGSqW7sULZJVTPcuvAe"
		};
		PayPalMobile.init(clientIDs, onPayPalMobileInit);
	};

	var onSuccesfulPayment = function(payment) {
		console.log("payment success: " + JSON.stringify(payment, null, 4));
		// mark as paid, save review and record of payment
		$ionicLoading.show();
		Users.submitReview($scope.review).then(function(response){
			Users.pay($scope.task, payment).then(function(response){
				$ionicLoading.show({
					template: "Payment Successful!",
					duration: 2000
				});
				if($scope.loggedIn.settings.general.easyMode){
					$state.go('easy.myprofile');
				}else{
					$state.go('tabs.myprofile');
				}
			});
		});
	};

	var onAuthorizationCallback = function(authorization) {
		console.log("authorization: " + JSON.stringify(authorization, null, 4));
	};

	var createPayment = function() {
		var pay = $scope.task.total.toString();
		var paymentDetails = new PayPalPaymentDetails(pay, "0.00", "0.00");
		var payment = new PayPalPayment(pay, "USD", $scope.task.title, "Sale",
		paymentDetails);
		return payment;
	};

	var configuration = function() {
		// for more options see `paypal-mobile-js-helper.js`
		var config = new PayPalConfiguration({
			merchantName: "Middleman",
			merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
			merchantUserAgreementURL: "https://mytestshop.com/agreement"
		});
		return config;
	};

	var onPrepareRender = function() {
		var buyNowBtn = document.getElementById("buyNowBtn");

		buyNowBtn.onclick = function(e) {
			if(validated()){
				PayPalMobile.renderSinglePaymentUI(createPayment(), onSuccesfulPayment, onUserCanceled);
			}
		};
	};

	var onPayPalMobileInit = function() {
		PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", configuration(),
		onPrepareRender);
	};

	var onUserCanceled = function(result) {
		console.log(result);
	};

	initPaymentUI();

})
























.controller('RepostController', function($scope, $stateParams, JobLocations, $ionicLoading, $state){
	$scope.task = {};

	$scope.$on('$ionicView.beforeEnter', function(){
		JobLocations.getTask($stateParams.taskID).then(function(task){
			task.expires = undefined;
			task.pay = task.pay.toString();
			$scope.task = task;
		});
	});

	$scope.repost = function(){
		$scope.submitOnce = true;
		$scope.task.timePosted = new Date().getTime();

		// validate form

		if($scope.task.expiresTemp !== "Until Completed"){
			$scope.task.expires = parseInt($scope.task.expiresTemp) * 1000*60*60*24 + $scope.task.timePosted;
		}

		if(validated()){
			JobLocations.repostTask($scope.task).then(function(response){
				if(response === 'success'){
					$ionicLoading.show({
						template: "Favor Posted!",
						duration: 2000
					});
					$state.go('myprofile');
				}else{
					$ionicLoading.show({
						template: "Error Posting Favor",
						duration: 2000
					});
				}
				$scope.submitOnce = false;
			});
		}else{
			$scope.submitOnce = false;
		}
	};
	var validated = function(){
		var errors = true;
		if($scope.task.category){
			document.getElementById("category").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.catError = false;
		}else{
			document.getElementById("category").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.catError = true;
		}
		if($scope.task.title){
			if($scope.task.title.length > 0 && $scope.task.title.length <= 18){
				document.getElementById("title").setAttribute("class", "item item-input signUpCorrect");
				$scope.titleError = false;
			}else{
				document.getElementById("title").setAttribute("class", "item item-input signUpError");
				$scope.titleError = true;
				errors = false;
			}
		}else{
			document.getElementById("title").setAttribute("class", "item item-input signUpError");
			$scope.titleError = true;
			errors = false;
		}
		if($scope.task.description){
			if($scope.task.description.length > 0 && $scope.task.description.length <= 180){
				document.getElementById("description").setAttribute("class", "item item-input signUpCorrect");
				$scope.descriptionError = false;
			}else{
				document.getElementById("description").setAttribute("class", "item item-input signUpError");
				$scope.descriptionError = true;
				errors = false;
			}
		}else{
			document.getElementById("description").setAttribute("class", "item item-input signUpError");
			$scope.descriptionError = true;
			errors = false;
		}
		document.getElementById("image").setAttribute("class", "item signUpCorrect");
		if($scope.task.estimatedTime){
			document.getElementById("estimatedTime").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.timeError = false;
		}else{
			document.getElementById("estimatedTime").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.timeError = true;
		}
		if($scope.task.pay){
			var regex = /(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
			if(regex.test($scope.task.pay) && !isNaN(parseFloat($scope.task.pay)) && $scope.task.pay > 0){
				document.getElementById("pay").setAttribute("class", "item item-input signUpCorrect");
				$scope.payError = false;
			}else{
				document.getElementById("pay").setAttribute("class", "item item-input signUpError");
				$scope.payError = true;
				errors = false;
			}
		}else{
			document.getElementById("pay").setAttribute("class", "item item-input signUpError");
			$scope.payError = true;
			errors = false;
		}
		if($scope.task.lat){
			document.getElementById("address").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.addressError = false;
		}else{
			document.getElementById("address").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.addressError = true;
		}
		if($scope.task.viewedBy){
			document.getElementById("viewedBy").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.viewError = false;
		}else{
			document.getElementById("viewedBy").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.viewError = true;
		}
		if($scope.task.expires){
			document.getElementById("expires").setAttribute("class", "item item-input item-select signUpCorrect");
			$scope.expiresError = false;
		}else{
			document.getElementById("expires").setAttribute("class", "item item-input item-select signUpError");
			errors = false;
			$scope.expiresError = true;
		}
		return errors;
	};

	$scope.$watch('task.pay', function(newValue, oldValue){
		var regex = /(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
		if($scope.task.pay){
			var pay = $scope.task.pay.replace(/[^0-9|\.]/,"");
			var parts = pay.split(".");
			if(parts.length > 1){
				var afterDecimal = parts[1].split("");
				if(afterDecimal.length === 1){
					$scope.task.pay = parts[0] + "." + afterDecimal[0];
				}else if(afterDecimal.length > 1){
					$scope.task.pay = parts[0] + "." + afterDecimal[0] + afterDecimal[1];
				}else{
					$scope.task.pay = pay;
				}
			}else{
				$scope.task.pay = pay;
			}
		}
	});

	$scope.getPhoto = function(location){
		$ionicPlatform.ready(function(){
			$cordovaCamera.getPicture({
				destinationType: navigator.camera.DestinationType.FILE_URL,
				sourceType: navigator.camera.PictureSourceType[location],
				correctOrientation: true
			}).then(function(photo){
				$jrCrop.crop({
					url: photo,
					height: 200,
					width: 200,
					title: 'Move and Scale'
				}).then(function(canvas) {
					$scope.task.image = canvas.toDataURL();
				}, function() {
					// User canceled or couldn't load image.
				});
			}, function(err){
				console.log(err);
			});
		});
	};
})























.controller('NotificationsController', function($scope, AuthService, Users, $rootScope, $state, JobLocations, $ionicLoading){

	$scope.$on('$ionicView.beforeEnter', function(){
		$rootScope.notifications = undefined;
		$scope.load();
	});

	$scope.directNotification = function(notification){
		if(notification.type === 'message'){
			JobLocations.getTask(notification.taskID).then(function(task){
				if(typeof task.completedBy !== 'undefined'){
					$ionicLoading.show({
						template: "Favor is complete, messages have expired!",
						duration: 2000
					});
				}else{
					if($scope.loggedIn.settings.general.easyMode){
						$state.go('easy.messagesN', {taskID: notification.taskID});
					}else{
						$state.go('tabs.messagesN',{taskID: notification.taskID});
					}
				}
			});
		}else{
			if($scope.loggedIn.settings.general.easyMode){
				$state.go('easy.profileN',{user: notification.user});
			}else{
				$state.go('tabs.profileN',{user: notification.user});
			}
		}
	};

	$scope.load = function(){
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
		});
		Users.getNotifications(window.localStorage.getItem("USER")).then(function(notifications){
			$scope.notifications = notifications;
			$scope.notifications.forEach(function(notification){
				setTimeSincePost(notification);
			});
		}).finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	var setTimeSincePost = function(task){
		var time = new Date().getTime() - task.date;
		if(Math.floor(time/(1000*60*60*24)) > 0){
			time = Math.floor(time/(1000*60*60*24));
			task.time = time + "d";
		}else if(Math.floor(time/(1000*60*60))){
			time = Math.floor(time/(1000*60*60));
			task.time = time + "h";
		}else{
			time = Math.floor(time/(1000*60));
			task.time = time + "m";
		}
	};
})


















.controller('MessagesController', function($scope, $stateParams, JobLocations, AuthService){

	$scope.input = {};

	$scope.$on('$ionicView.beforeEnter', function(){
		JobLocations.getTask($stateParams.taskID).then(function(task){
			JobLocations.markAsRead(task._id, window.localStorage.getItem("USER"));
			AuthService.currentUser().then(function(currentUser){
				$scope.loggedIn = currentUser;
				$scope.task = task;
				task.messages.forEach(function(message){
					message.date = new Date(message.date);
				});
				$scope.messages = task.messages;
			});
		});
	});

	$scope.sendMessage = function(){
		$scope.input.date = Date.now();
		$scope.input.sender = window.localStorage.getItem("USER");
		if($scope.task.postedBy === $scope.input.sender){
			$scope.input.receiver = $scope.task.assignedTo;
		}else{
			$scope.input.receiver = $scope.task.postedBy;
		}
		$scope.input.taskID = $scope.task._id;
		JobLocations.addMessage($scope.input).then(function(response){
			$scope.messages = response;
			$scope.input = {};
		});
	};

})


















.controller('MoreInfoController', function($scope, $state, $ionicLoading, AuthService, $ionicModal, $ionicPlatform, $cordovaCamera, $jrCrop, Users, Settings){

	$scope.logout = function(){
		AuthService.logout();
	};

	$scope.$on('$ionicView.beforeEnter', function(){
		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			$scope.reviews = $scope.loggedIn.reviews;
		});
	});

	$scope.editProfile = function(){
		$scope.temp = {};
		$scope.temp.username = $scope.loggedIn.username;
		$scope.temp.avatar = $scope.loggedIn.avatar;
		$scope.temp.first = $scope.loggedIn.first;
		$scope.temp.last = $scope.loggedIn.last;
		$scope.temp.reviews = $scope.reviews;
		$ionicModal.fromTemplateUrl('views/profile/edit-profile.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.editReviews = function(){
		$scope.temp = {};
		$scope.temp.username = $scope.loggedIn.username;
		$scope.temp.avatar = $scope.loggedIn.avatar;
		$scope.temp.first = $scope.loggedIn.first;
		$scope.temp.last = $scope.loggedIn.last;
		$scope.temp.reviews = $scope.reviews;
		$ionicModal.fromTemplateUrl('views/profile/edit-reviews.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.changePassword = function(){
		$scope.temp = {};
		$ionicModal.fromTemplateUrl('views/profile/change-password.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.getPhoto = function(location){
		$ionicPlatform.ready(function(){
			$cordovaCamera.getPicture({
				destinationType: navigator.camera.DestinationType.FILE_URL,
				sourceType: navigator.camera.PictureSourceType[location],
				correctOrientation: true
			}).then(function(photo){
				$jrCrop.crop({
					url: photo,
					height: 200,
					width: 200,
					circle: true,
					title: 'Move and Scale'
				}).then(function(canvas) {
					$scope.temp.newAvatar = canvas.toDataURL();
					$scope.temp.avatar = canvas.toDataURL();
				}, function() {
					// User canceled or couldn't load image.
				});
			}, function(err){
				console.log(err);
			});
		});
	};

	$scope.hideModal = function () {
		$scope.modal.remove();
	};

	$scope.$on('$destroy', function() {
		if($scope.modal){
			$scope.modal.remove();
		}
	});

	$scope.updateProfile = function(page){
		var check = false;
		switch(page){
			case 'profile':
			check = profileValidated();
			break;
			case 'password':
			check = passwordValidated();
			break;
			case 'reviews':
			check = true;
		}
		if(check){
			$ionicLoading.show();
			Users.updateUser($scope.loggedIn.username, $scope.temp).success(function(response){
				if(response === 'success'){
					$ionicLoading.show({
						template: "Profile Updated!",
						duration: 2000
					});
					Users.getUser($scope.loggedIn.username).then(function(user){
						$scope.loggedIn = user;
						$scope.modal.hide();
					});
				}else{
					$ionicLoading.show({
						template: "Profile Update Failed!",
						duration: 2000
					});
				}
			})
			.error(function(){
				$ionicLoading.show({
					template: "Profile Update Failed!",
					duration: 2000
				});
			});
		}
	};

	var profileValidated = function(){
		var errors = true;
		if($scope.temp.first){
			if($scope.temp.first.length > 0 && $scope.temp.first.length <= 25){
				document.getElementById("first").setAttribute("class", "item item-input signUpCorrect");
				$scope.firstError = false;
			}else{
				document.getElementById("first").setAttribute("class", "item item-input signUpError");
				$scope.firstError = true;
				errors = false;
			}
		}else{
			document.getElementById("first").setAttribute("class", "item item-input signUpError");
			$scope.firstError = true;
			errors = false;
		}
		if($scope.temp.last){
			if($scope.temp.last.length > 0 && $scope.temp.last.length <= 25){
				document.getElementById("last").setAttribute("class", "item item-input signUpCorrect");
				$scope.lastError = false;
			}else{
				document.getElementById("last").setAttribute("class", "item item-input signUpError");
				$scope.lastError = true;
				errors = false;
			}
		}else{
			document.getElementById("last").setAttribute("class", "item item-input signUpError");
			$scope.lastError = true;
			errors = false;
		}
		if($scope.temp.last){
			document.getElementById("avatar").setAttribute("class", "item item-input signUpCorrect");
			$scope.avatarError = false;
		}else{
			document.getElementById("avatar").setAttribute("class", "item item-input signUpError");
			errors = false;
			$scope.avatarError = true;
		}
		if($scope.temp.bio){
			if($scope.temp.bio.length <= 180){
				document.getElementById("description").setAttribute("class", "item item-input signUpCorrect");
				$scope.bioError = false;
			}else{
				document.getElementById("description").setAttribute("class", "item item-input signUpError");
				$scope.bioError = true;
				errors = false;
			}
		}
		return errors;
	};

	var passwordValidated = function(){
		var errors = true;
		if($scope.temp.password){
			if($scope.temp.password.length <= 6){
				document.getElementById("pass").setAttribute("class", "signUpError");
				$scope.passwordError = true;
				errors = false;
			}else{
				document.getElementById("pass").setAttribute("class", "signUpCorrect");
				$scope.passwordError = false;
			}
		}else{
			document.getElementById("pass").setAttribute("class", "signUpError");
			$scope.passwordError = true;
			errors = false;
		}
		if($scope.temp.confirmedPassword){
			if($scope.temp.confirmedPassword === $scope.temp.password){
				document.getElementById("passCon").setAttribute("class", "signUpCorrect");
				$scope.conPassError = false;
			}else{
				document.getElementById("passCon").setAttribute("class", "signUpError");
				$scope.conPassError = true;
				errors = false;
			}
		}else{
			document.getElementById("passCon").setAttribute("class", "signUpError");
			$scope.conPassError = true;
			errors = false;
		}
		return errors;
	};

	$scope.$watch('loggedIn.settings', function(newValue, oldValue){
		if(typeof oldValue === 'undefined'){
			return;
		}
		if(typeof $scope.loggedIn !== 'undefined'){
			Settings.updateSettings($scope.loggedIn.settings, $scope.loggedIn.username).then(function(response){
				window.localStorage.setItem("EASY_MODE", $scope.loggedIn.settings.general.easyMode);
				if($scope.loggedIn.settings.general.easyMode){
					$ionicLoading.show({
						template: "Switched to Easy Mode",
						duration: 1000
					});
					$state.go('easy.myprofile');

				}else{
					$ionicLoading.show({
						template: "Switched to Normal Mode",
						duration: 1000
					});
					$state.go('tabs.myprofile');
				}
			});
		}
	}, true);

	$scope.helpAccept = function(){
		$ionicModal.fromTemplateUrl('views/help/accept.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.helpComplete = function(){
		$ionicModal.fromTemplateUrl('views/help/complete.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.helpPay = function(){
		$ionicModal.fromTemplateUrl('views/help/pay.html',{
			scope: $scope
		}).then(function(modal){
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

})


























.controller('ResetPasswordController', function($scope, Users, $ionicLoading){
	$scope.resetPassword = {};

	Users.getUsernames().then(function(usernames){
		$scope.emails = [];
		usernames.forEach(function(username){
			$scope.emails.push(username.email);
		});
	});

	$scope.resetPassword = function(){
		$scope.noEmail = false;
		if($scope.emails.indexOf($scope.resetPassword.email) === -1){
			$scope.noEmail = true;
		}else{
			Users.resetPassword($scope.resetPassword.email).then(function(response){
				if('success'){
					$ionicLoading.show({
						template: "Your new password has been sent to your email address. Please log in and change it!",
						duration: 3000
					});
				}else{
					$ionicLoading.show({
						template: "Password Reset Failed! Please try again.",
						duration: 2000
					});
				}
			});
		}
	};

})

















.controller('YourFavorsController', function($scope, AuthService){

	$scope.$on('$ionicView.beforeEnter', function(){

		$scope.favors = [];
		$scope.paid = [];
		$scope.tasks = [];
		$scope.expiredTasks = [];

		AuthService.currentUser().then(function(currentUser){
			$scope.loggedIn = currentUser;
			$scope.favors = $scope.loggedIn.tasks;
			$scope.loggedIn.requests.sort(function(a,b){
				return b.timePosted - a.timePosted;
			});
			// Settings to show show closed and expired tasks in my profile
			if($scope.loggedIn.settings.myProfile.closed){
				$scope.closedRequests = closedRequests;
			}
			if($scope.loggedIn.settings.myProfile.expired){
				$scope.expiredRequests = expiredRequests;
			}
			$scope.loggedIn.tasks.sort(function(a,b){
				return b.timePosted - a.timePosted;
			});
			$scope.loggedIn.tasks.forEach(function(task){
				task = setExpiresIn(task);
				if(task.paidFor){
					$scope.paid.push(task);
				}else{
					if(typeof task.assignedTo === 'undefined' && task.expiresDate < new Date()){
						$scope.expiredTasks.push(task);
					}else{
						$scope.tasks.push(task);
					}
				}
			});
		});
	});

	var setExpiresIn = function(task){
		if(task.expires !== "Until Completed"){
			task.expiresDate = new Date(parseInt(task.expires));
			return task;
		}else{
			task.expiresDate = "Completed";
			return task;
		}
	};

	$scope.taskAssigned = function(task){
		return typeof task.assignedTo !== 'undefined';
	};

	$scope.completed = function(task){
		if(typeof task.completedBy !== 'undefined'){
			return true;
		}else{
			return false;
		}
	};

	$scope.taskCompleted = function(task){
		if(typeof task.completedBy === 'undefined'){
			Users.completeTask(task).then(function(response){
				task.completedBy = task.assignedTo;
			});
		}
	};

	$scope.taskAccepted = function(task){
		if(typeof task.assignedTo !== 'undefined'){
			return true;
		}else{
			return false;
		}
	};

});
