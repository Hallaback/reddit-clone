var cherrit = angular.module('cherrit', ['ui.router']);

cherrit.config(function($urlRouterProvider, $stateProvider){
	$urlRouterProvider.otherwise('/whoops');

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "posts.html",
			controller: "posts-ctrl"
		})
		.state('whoops', {
			url: "/whoops",
			templateUrl: "whoops.html"
		})
		.state('compose', {
			url: "/compose",
			templateUrl: "compose.html",
			controller: "compose-ctrl"
		})
		.state('post', {
			url: "/posts/:id",
			templateUrl: "post.html",
			controller: "post-ctrl"
		})
});

cherrit.service('posts', function($http){

	$http.defaults.headers.common['X-Parse-Application-Id'] = '0oeoVQ22czn78t0Xgwu0nN6e05wZKd7H5jVUQYNg';
    $http.defaults.headers.common['X-Parse-REST-API-Key'] = '61I8V7T5rKynKsn54oVMdT21CU7TPQnVqMYjfhrg';

	this.getAll = function(){
		return $http.get('https://api.parse.com/1/classes/posts')
	}

	this.getOne = function(id){
		return $http.get('https://api.parse.com/1/classes/posts/' + id)
	}

	this.remove = function(id){
		return $http.delete('https://api.parse.com/1/classes/posts/' + id)
	}

	this.create = function(post){
		return $http.post('https://api.parse.com/1/classes/posts/', post)
	}

	this.upvote = function(post){
		var newPost = {};
		angular.copy(post, newPost);
		newPost.upvote++;
		return	$http.put('https://api.parse.com/1/classes/posts/' + newPost.objectId, post)

	}

	this.downvote = function(post){
		var newPost = {};
		angular.copy(post, newPost);
		newPost.downvote--;
		return	$http.put('https://api.parse.com/1/classes/posts/' + newPost.objectId, post)

	}
});

cherrit.controller('posts-ctrl', function($scope, posts){
	posts.getAll().then(function(data){
		$scope.posts = data.data.results;
	});

	$scope.upvote = function(post){
		posts.upvote(post).then(function(){
			post.upvote++;
		})
	}
	$scope.downvote = function(post){
		posts.downvote(post).then(function(){
			post.upvote--;
		})
	}
});

cherrit.controller('compose-ctrl', function($scope, posts){
	posts.getAll().then(function(data){
		$scope.posts = data.data.results;
	})

	$scope.post = {};

	$scope.cancel = function(){
		$scope.post = {};
	}

	$scope.submit = function(){
		posts.create($scope.post).then(function(){
			$scope.cancel;
		})
	}
	
});

cherrit.controller('post-ctrl', function($scope, posts){
	console.log(posts.getOne(9));
});