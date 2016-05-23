// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// Make this variable true if you are in development, make it false before pushing to live
var devBool = false;
if (devBool){
	var servName = "ˆ";
}
else{
	var servName = "https://api-middleman.herokuapp.com";
}



angular.module('app', ['ionic','ionic.service.core', 'ionic.service.analytics','app.controllers', 'app.services','angular-jwt','angular-storage', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, AuthService, $state, store, $ionicAnalytics, $cordovaStatusbar) {

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			cordova.plugins.Keyboard.disableScroll(false);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			window.StatusBar.styleDefault();
		}

		$ionicAnalytics.register();

		var push = new Ionic.Push({
			'onNotification': function(notification){
				$rootScope.$apply(function(){
					if($rootScope.notifications){
						$rootScope.notifications += 1;
					}else{
						$rootScope.notifications = 1;
					}
				});
			}

		});

		push.register(function(token) {
			window.localStorage.setItem("pushToken", token.token);
		});
	});
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, jwtInterceptorProvider) {

	$ionicConfigProvider.tabs.position('bottom');
	$ionicConfigProvider.views.transition('none');

	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tabs', {
		url: '/tabs',
		abstract: true,
		templateUrl: 'views/tabs/tabs.html'
	})
	.state('easy', {
		url: '/easy',
		abstract: true,
		templateUrl: 'views/easy/easy.html'
	})
	.state('landing', {
		url: '/landing',
		templateUrl: 'views/landing/landing.html',
		controller: 'LandingController'
	})
	.state('signup', {
		url: '/signup',
		templateUrl: 'views/signup/signup.html',
		controller: 'SignUpController'
	})
	.state('login', {
		url: '/login',
		templateUrl: 'views/login/login.html',
		controller: 'LoginController'
	})
	.state('resetPassword', {
		url: '/resetPassword',
		templateUrl: 'views/login/forgotPassword.html',
		controller: 'ResetPasswordController'
	})
	.state('tour',{
		url: '/tour',
		templateUrl: 'views/tour/tour.html'
	})

	// set up views for home tab - needs taskDetail, profile, trusts, trustedBy
	.state('tabs.home',{
		url: '/home',
		views: {
			'home-tab': {
				templateUrl: 'views/home/home.html',
				controller: 'HomeController'
			}
		}
	})
	.state('tabs.profileH',{
		url: '/profile?user',
		views: {
			'home-tab': {
				templateUrl: 'views/home/profile-h.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('tabs.taskDetailH',{
		url: '/taskDetail?taskID',
		views: {
			'home-tab': {
				templateUrl: 'views/home/task-detail-h.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('tabs.trustedByH', {
		url: '/trusted-by?user',
		views: {
			'home-tab':{
				templateUrl: 'views/home/trusted-by-h.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('tabs.trustsH', {
		url: '/trusts?user',
		views:{
			'home-tab':{
				templateUrl: 'views/home/trusts-h.html',
				controller: 'TrustsController'
			}
		}
	})

	//set up views for askFavor tab
	.state('tabs.askFavor', {
		url: '/ask-favor',
		views: {
			'askFavor-tab': {
				templateUrl: 'views/ask-favor/ask-favor.html',
				controller: 'AskFavorController'
			}
		}
	})
	//set up views for favorFeed tab - needs taskDetail, profile, trusts, trustedBy
	.state('tabs.favorFeed', {
		url: '/favor-feed',
		views: {
			'favorFeed-tab': {
				templateUrl: 'views/favor-feed/favor-feed.html',
				controller: 'FavorFeedController'
			}
		}
	})
	.state('tabs.taskDetailFF',{
		url: '/taskDetail?taskID',
		views: {
			'favorFeed-tab': {
				templateUrl: 'views/favor-feed/task-detail-ff.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('tabs.profileFF',{
		url: '/profile?user',
		views: {
			'favorFeed-tab': {
				templateUrl: 'views/favor-feed/profile-ff.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('tabs.trustedByFF', {
		url: '/trusted-by?user',
		views: {
			'favorFeed-tab':{
				templateUrl: 'views/favor-feed/trusted-by-ff.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('tabs.trustsFF', {
		url: '/trusts?user',
		views:{
			'favorFeed-tab':{
				templateUrl: 'views/favor-feed/trusts-ff.html',
				controller: 'TrustsController'
			}
		}
	})

	//set up views for search - needs taskDetail, profile, trusts, trustedBy
	.state('tabs.search', {
		url: '/search',
		views: {
			'search-tab': {
				templateUrl: 'views/search/search.html',
				controller: 'SearchController'
			}
		}
	})
	.state('tabs.profileS',{
		url: '/profile?user',
		views: {
			'search-tab': {
				templateUrl: 'views/search/profile-s.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('tabs.taskDetailS',{
		url: '/taskDetail?taskID',
		views: {
			'search-tab': {
				templateUrl: 'views/search/task-detail-s.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('tabs.trustedByS', {
		url: '/trusted-by?user',
		views: {
			'search-tab':{
				templateUrl: 'views/search/trusted-by-s.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('tabs.trustsS', {
		url: '/trusts?user',
		views:{
			'search-tab':{
				templateUrl: 'views/search/trusts-s.html',
				controller: 'TrustsController'
			}
		}
	})

	//set up views for notifications - needs taskDetail, profile, trusts, trustedBy
	.state('tabs.notifications', {
		url: '/notifications',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications/notifications.html',
				controller: 'NotificationsController'
			}
		}
	})
	.state('tabs.profileN',{
		url: '/profile?user',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications/profile-n.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('tabs.taskDetailN',{
		url: '/taskDetail?taskID',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications/task-detail-n.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('tabs.trustedByN', {
		url: '/trusted-by?user',
		views: {
			'notifications-tab':{
				templateUrl: 'views/notifications/trusted-by-n.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('tabs.trustsN', {
		url: '/trusts?user',
		views:{
			'notifications-tab':{
				templateUrl: 'views/notifications/trusts-n.html',
				controller: 'TrustsController'
			}
		}
	})
	.state('tabs.messagesN', {
		url: '/messages?taskID',
		views:{
			'notifications-tab':{
				templateUrl: 'views/notifications/messages-n.html',
				controller: 'MessagesController'
			}
		}
	})
	//set up views for myprofile - needs taskDetail, profile, trusts, trustedBy, messages, repost
	.state('tabs.myprofile', {
		url: '/myprofile',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/profile/myprofile.html',
				controller: 'MyProfileController'
			}
		}
	})
	.state('tabs.profileMP',{
		url: '/profile?user',
		views: {
			'myprofile-tab': {
				templateUrl: 'views/profile/profile.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('tabs.taskDetailMP',{
		url: '/taskDetail?taskID',
		views: {
			'myprofile-tab': {
				templateUrl: 'views/profile/task-detail.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('tabs.trustedByMP', {
		url: '/trusted-by?user',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/profile/trusted-by.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('tabs.trustsMP', {
		url: '/trusts?user',
		views:{
			'myprofile-tab':{
				templateUrl: 'views/profile/trusts.html',
				controller: 'TrustsController'
			}
		}
	})
	.state('tabs.requesters', {
		url: '/requesters?taskID',
		views:{
			'myprofile-tab':{
				templateUrl: 'views/requesters/requesters.html',
				controller: 'RequestersController'
			}
		}
	})
	.state('tabs.pay', {
		url: '/pay?taskID',
		views:{
			'myprofile-tab':{
				templateUrl: 'views/pay/pay.html',
				controller: 'PayController'
			}
		}
	})
	.state('tabs.repost', {
		url: '/repost?taskID',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/repost/repost.html',
				controller: 'RepostController'
			}
		}
	})
	.state('tabs.messages', {
		url: '/messages?taskID',
		views: {
			'myprofile-tab': {
				templateUrl: 'views/messages/messages.html',
				controller: 'MessagesController'
			}
		}
	})
	.state('tabs.moreInfo', {
		url: '/moreInfo',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/more-info/more-info.html',
				controller: 'MoreInfoController'
			}
		}
	})
	.state('tabs.settingsFF', {
		url: '/settings',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/settings/settingsFF.html',
				controller: 'SettingsController'
			}
		}
	})
	.state('tabs.settingsMP', {
		url: '/settings',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/settings/settingsMP.html',
				controller: 'SettingsController'
			}
		}
	})
	.state('help', {
		url: '/help',
		templateUrl: 'views/help/help.html',
		controller: 'HelpController'
	})

	//Easy mode

	//set up views for askFavor tab
	.state('easy.askFavor', {
		url: '/ask-favor',
		views: {
			'askFavor-tab': {
				templateUrl: 'views/ask-favor-easy/ask-favor.html',
				controller: 'AskFavorController'
			}
		}
	})

	//set up views for notifications - needs taskDetail, profile, trusts, trustedBy
	.state('easy.notifications', {
		url: '/notifications',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications-easy/notifications.html',
				controller: 'NotificationsController'
			}
		}
	})
	.state('easy.profileN',{
		url: '/profile?user',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications-easy/profile-n.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('easy.taskDetailN',{
		url: '/taskDetail?taskID',
		views: {
			'notifications-tab': {
				templateUrl: 'views/notifications-easy/task-detail-n.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('easy.trustedByN', {
		url: '/trusted-by?user',
		views: {
			'notifications-tab':{
				templateUrl: 'views/notifications-easy/trusted-by-n.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('easy.trustsN', {
		url: '/trusts?user',
		views:{
			'notifications-tab':{
				templateUrl: 'views/notifications-easy/trusts-n.html',
				controller: 'TrustsController'
			}
		}
	})
	.state('easy.messagesN', {
		url: '/messages?taskID',
		views:{
			'notifications-tab':{
				templateUrl: 'views/notifications-easy/messages-n.html',
				controller: 'MessagesController'
			}
		}
	})

	//set up views for your favors
	.state('easy.yourFavors', {
		url: '/your-favors',
		views: {
			'yourFavors-tab':{
				templateUrl: 'views/your-favors-easy/yourFavors.html',
				controller: 'YourFavorsController'
			}
		}
	})
	.state('easy.requesters', {
		url: '/requesters?taskID',
		views:{
			'yourFavors-tab':{
				templateUrl: 'views/requesters-easy/requesters.html',
				controller: 'RequestersController'
			}
		}
	})
	.state('easy.pay', {
		url: '/pay?taskID',
		views:{
			'yourFavors-tab':{
				templateUrl: 'views/pay-easy/pay.html',
				controller: 'PayController'
			}
		}
	})
	.state('easy.repost', {
		url: '/repost?taskID',
		views: {
			'yourFavors-tab':{
				templateUrl: 'views/repost-easy/repost.html',
				controller: 'RepostController'
			}
		}
	})
	.state('easy.messages', {
		url: '/messages?taskID',
		views: {
			'yourFavors-tab': {
				templateUrl: 'views/messages-easy/messages.html',
				controller: 'MessagesController'
			}
		}
	})

	//set up views for myprofile - needs taskDetail, profile, trusts, trustedBy, messages, repost
	.state('easy.myprofile', {
		url: '/myprofile',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/profile-easy/myprofile.html',
				controller: 'MyProfileController'
			}
		}
	})
	.state('easy.profileMP',{
		url: '/profile?user',
		views: {
			'myprofile-tab': {
				templateUrl: 'views/profile-easy/profile.html',
				controller: 'ProfileController'
			}
		}
	})
	.state('easy.taskDetailMP',{
		url: '/taskDetail?taskID',
		views: {
			'myprofile-tab': {
				templateUrl: 'views/profile-easy/task-detail.html',
				controller: 'TaskDetailController'
			}
		}
	})
	.state('easy.trustedByMP', {
		url: '/trusted-by?user',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/profile-easy/trusted-by.html',
				controller: 'TrustedByController'
			}
		}
	})
	.state('easy.trustsMP', {
		url: '/trusts?user',
		views:{
			'myprofile-tab':{
				templateUrl: 'views/profile-easy/trusts.html',
				controller: 'TrustsController'
			}
		}
	})
	.state('easy.moreInfo', {
		url: '/moreInfo',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/more-info-easy/more-info.html',
				controller: 'MoreInfoController'
			}
		}
	})
	.state('easy.settingsFF', {
		url: '/settings',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/settings-easy/settingsFF.html',
				controller: 'SettingsController'
			}
		}
	})
	.state('easy.settingsMP', {
		url: '/settings',
		views: {
			'myprofile-tab':{
				templateUrl: 'views/settings-easy/settingsMP.html',
				controller: 'SettingsController'
			}
		}
	});


	// if none of the above states are matched, use this as the fallback
	if(window.localStorage.getItem("USER")){
		if(window.localStorage.getItem("EASY_MODE") === "true"){
			$urlRouterProvider.otherwise('/easy/ask-favor');
		}else{
			$urlRouterProvider.otherwise('/tabs/favor-feed');
		}
	}else{
		$urlRouterProvider.otherwise('/landing');
	}


	jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, store) {
		var idToken = store.get('TOKEN');
		var refreshToken = store.get('REFRESH_TOKEN');
		if(idToken){
			if (jwtHelper.isTokenExpired(idToken)) {
				// This is a promise of a JWT id_token
				return $http({
					url: servName + '/delegation',
					// This makes it so that this request doesn't send the JWT
					skipAuthorization: true,
					method: 'POST',
					data: {
						grant_type: 'refresh_token',
						refresh_token: refreshToken
					}
				}).then(function(response) {
					var id_token = response.data.token;
					store.set('TOKEN', id_token);
					return id_token;
				});
			} else {
				return idToken;
			}
		}else{
			return null;
		}
	};

	$httpProvider.interceptors.push('jwtInterceptor');

})

.run(function($rootScope, store, $state, jwtHelper, AuthService){

	var refreshingToken = null;
	$rootScope.$on('$locationChangeStart', function() {
		var token = store.get('TOKEN');
		var refreshToken = store.get('REFRESH_TOKEN');
		// Has user signed in and has a token
		if (token) {
			// User has a token in local storage
			// Is the token expired?
			if (!jwtHelper.isTokenExpired(token)) {
				// users token is not expired, check to see if user is in local storage
				if (!window.localStorage.getItem("USER")) {
					$state.go('login');
				}
			} else {
				if (refreshToken) {
					if (refreshingToken === null) {
						$http({
							url: servName + '/delegation',
							// This makes it so that this request doesn't send the JWT
							skipAuthorization: true,
							method: 'POST',
							data: {
								grant_type: 'refresh_token',
								refresh_token: refreshToken
							}
						}).then(function(response) {
							var id_token = response.data.token;
							store.set('TOKEN', id_token);
							if(!window.localStorage.getItem("USER")){
								$state.go('login');
							}
						}).finally(function() {
							refreshingToken = null;
						});
					}
					return refreshingToken;
				} else {
					$state.go('login');
				}
			}
		}
	});
});
