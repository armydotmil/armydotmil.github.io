/*global document,require*/

var Playlist = require('./modules/Playlist');

(function() {
    'use strict';

    var playlist = new Playlist();

    playlist.loadYTPlayer();
})();
