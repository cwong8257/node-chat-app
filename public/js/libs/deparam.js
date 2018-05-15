/**
 * Parses a paramter string and returns an object of query string parameters.
 */
(function (global) {
  global.deparam =
    global.deparam ||
    function (uri) {
      if (uri === undefined) {
        uri = window.location.search;
      }
      const queryString = {};
      uri.replace(new RegExp('([^?=&]+)(=([^&#]*))?', 'g'), function ($0, $1, $2, $3) {
        queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
      });
      return queryString;
    };
}(window));
