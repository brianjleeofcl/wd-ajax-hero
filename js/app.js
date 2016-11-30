(function() {
  'use strict';

  let movies = [];
  let page = 1;

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  const addMovie = function(results) {
    for (const result of results) {
      const $xhr = $.ajax({
        method: 'GET',
        url: `https:www.omdbapi.com/?i=${result.imdbID}`,
        dataType: 'json'
      })

      $xhr.done((data) => {
        const movie = {};

        movie['id'] = data.imdbID;
        movie['title'] = data.Title;
        movie['year'] = data.Year;

        if (data.Poster === 'N/A') {
          movie['poster'] = 'http://www.catholic-ew.org.uk/var/storage/images/cbcew2/cbcew-media-library/images/cbcew-images/movie-poster-unavailable-150px/157177-1-eng-GB/Movie-poster-unavailable-150px_large.jpg';
        } else {
          movie['poster'] = data.Poster;
        }

        if (data.Plot === 'N/A') {
          movie['plot'] = 'Plot unavailable.'
        } else {
          movie['plot'] = data.Plot;
        }

        movies.push(movie);

        renderMovies();
      })
    }

  };

  const searchApi = function(page) {
    const searchTerm = $('#search').val();

    if (searchTerm === '') {
      Materialize.toast('Please enter a search term.', 3000);
      return;
    }

    const $xhr = $.ajax({
      method: 'GET',
      url: `https:www.omdbapi.com/?s=${searchTerm}&page=${page}`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }

      let results = data.Search;

      addMovie(results);
    });
  }

  $('form').on('submit', () => {
    event.preventDefault();
    movies = [];
    $('#loader').removeAttr('style')

    searchApi(page);
  });

  $('#search').on('click', () => {
    $('#search').val('');
  })

  $('#loader').on('click', () => {
    page++
    searchApi(page);
  })
})();
