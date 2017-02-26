const app = angular.module('MovieApp', []);

app.controller('TopMoviesController', function ($scope, MovieData) {
	$scope.topMovies = MovieData.getTopMovies();
	$scope.genres = MovieData.getGenres();
});

app.controller('ShowMoviesController', function ($scope, MovieData) {
	$scope.movies = MovieData.getMovies();
	$scope.genres = MovieData.getGenres();
	
	$scope.rate = function(item, rate) {
		if (item.rating === null) {
			MovieData.rateMovie(item, rate);
		} else {
			alert('You have already rated this movie.');
		}
	};
	
	$scope.remove = function(id) {
		$scope.movies.splice(id, 1);
	};
});

app.factory('MovieData', function($http) {
	
	// Define movies db locally (manipulate movie ratings here)
	const movies = [];
	const genres = {};
	const topMovies = [];
	
	// Add movie constructor
	function Movie(movie) {
		this.title = movie.title;
		this.image = `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`;
		this.releaseDate = movie.release_date;
		this.genreIds = movie.genre_ids;
		this.desc = movie.overview;
		this.rating = null; // number 1-5
		
		return this;
	}
	
	// Get initial list of movies from the server
	$http.get('https://api.themoviedb.org/3/discover/movie?api_key=033f28bd5adb08417059e695b078940d').then(function(response) {
		for (let i=0; i<response.data.results.length; i++) {
			response.data.results[i] = new Movie(response.data.results[i]);
		}
//		response.data.results = response.data.results.map(movie => new Movie(movie));
		angular.copy(response.data.results, movies);
	});
	
	// Get list of genres and corresponding ids 
	$http.get('https://api.themoviedb.org/3/genre/movie/list?api_key=033f28bd5adb08417059e695b078940d&language=en-US').then(function(response) {
		// Add each object to genres object as a new property
		response.data.genres.forEach(genre => {
			genres[genre.id] = genre.name;
		});
	});
	
	// Return the service object
	return {
    	getMovies() {
            return movies;
        },
		getGenres() {
			return genres;
		},
		rateMovie(ratedMovie, rating) {
			ratedMovie.rating = rating;
			if (rating >= 4) {
				topMovies.push(ratedMovie);
			}
		},
		getTopMovies() {
			return topMovies;
		},
    };
});