/*global document*/

import Playlist from './modules/Playlist';

(function() {
    var playlist = new Playlist();
    playlist.loadYTPlayer();
})();
// accordion and other accessibility hooks
import './modules/AccordionHooks';