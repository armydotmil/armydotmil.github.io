/*global document,window, init, require, class*/
/*jshint -W032 */
/* ignore unnecessary semicolon */
import Helper from './Helper';
var youtube = require('youtube-iframe-player');

class Playlist {
    constructor(context) {
        this.domContext = context || document;
        this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.ytPlayers = {};

        this.resetToggles();
    }

    resetToggles() {
        var _this = this,
            toggles,
            i,
            plHeader;

        plHeader = this.domContext.getElementsByClassName('playlist-info');
        toggles = this.domContext.getElementsByClassName('playlist-toggle');

        for (i = 0; i < plHeader.length; i++) {
            if (!Helper.hasClass(plHeader[i], 'enable-playlist')) {

                plHeader[i].addEventListener(
                    'click',
                    function() {
                        _this.toggle(this.parentNode.parentNode);
                    },
                    false
                );

                Helper.addClass(plHeader[i], 'enable-playlist');
            }
        }
        for (i = 0; i < toggles.length; i++) {
            if (!Helper.hasClass(toggles[i], 'enable-playlist')) {

                toggles[i].addEventListener(
                    'click',
                    function() {
                        _this.toggle(this.parentNode.parentNode);
                    },
                    false
                );

                Helper.addClass(toggles[i], 'enable-playlist');
            }
        }
    }

    toggle(list) {
        if (Helper.hasClass(list, 'open-playlist')) {
            Helper.removeClass(list, 'open-playlist');
        } else {
            Helper.addClass(list, 'open-playlist');
        }
    }

    setYTPlayer(elem) {
        var ytPlayer = elem.getElementsByClassName('ytPlayer'),
            playerId = null,
            videoList,
            ytid,
            isPlaylist,
            isCustomList,
            vidObj,
            _this = this;

        if (ytPlayer.length > 0) {
            playerId = ytPlayer[0].getAttribute('id');
        }
        // only continue if the player does not have an Id already
        if (!playerId && ytPlayer.length > 0) {
            ytPlayer = ytPlayer[0];
            videoList = elem.getElementsByClassName('videos');
            playerId = 'ytPlayer' + Helper.randomNumberToken();
            ytid = ytPlayer.getAttribute('data-ytid');
            isPlaylist = (ytPlayer.hasAttribute('data-playlist'));
            isCustomList = (videoList.length);
            vidObj = {
                width: '560',
                height: '315'
            };
            vidObj.playerVars = {
                'autoplay': 0,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'wmode': 'opaque'
            };

            if (!isPlaylist) {
                vidObj.videoId = ytid;
            } else {
                vidObj.playerVars.listType = 'playlist';
                vidObj.playerVars.list = ytid;
            }
            if (isCustomList) {
                vidObj.events = {
                    'onReady': function(e) {
                        _this.playerReady(e, _this);
                    },
                    'onStateChange': function(e) {
                        _this.playerStateChange(e, _this);
                    }
                };
                vidObj.playerVars.showinfo = 0;
            }

            // create the actual player and store playlist reference
            this.ytPlayers[playerId] = elem;
            ytPlayer.setAttribute('id', playerId);
            youtube.createPlayer(playerId, vidObj);
        }
    }

    resetYTPlayer() {
        this.resetToggles();
        this.loadYTPlayer();
    }

    loadYTPlayer() {
        var _this = this;

        if (this.domContext.getElementsByClassName('ytPlayer').length) {
            youtube.init(function() {
                _this.loadYTPlayers();
            });
        }
    }

    loadYTPlayers() {
        var plElems = this.domContext.getElementsByClassName('playlist'),
            i;

        for (i = 0; i < plElems.length; i++) {
            this.setYTPlayer(plElems[i]);
        }
    }

    playerReady(event, context) {
        var videoData = event.target.getIframe(),
            key = videoData.id,
            videos = context.ytPlayers[key].querySelectorAll(
                '.videos .video-item');

        Helper.addClass(context.ytPlayers[key], 'playlist-ready');

        [].map.call(videos, function(elem) {
            elem.addEventListener('click', function() {
                if (!Helper.hasClass(this, 'active')) {
                    context.selectVideo(event, this, context.ytPlayers[key]);
                } else if (!context.iOS) {
                    context.toggleVideo(event.target);
                }
            }, false);
        });
    }

    toggleVideo(vid) {
        if (vid.getPlayerState() === 1) {
            vid.pauseVideo();
        } else {
            vid.playVideo();
        }
    }

    selectVideo(event, vidItem, plElement) {
        var index = 0,
            videos = plElement.querySelectorAll(
                '.videos .video-item'),
            vidCounter = plElement.querySelectorAll('.sel-vid-index'),
            thisytid = (vidItem.dataset) ?
            vidItem.dataset.ytid :
            vidItem.getAttribute('data-ytid');

        [].map.call(videos, function(elem) {
            Helper.removeClass(elem, 'active');
        });
        Helper.addClass(vidItem, 'active');

        // this is for showing a 5/33 type of counter...
        if (vidCounter.length) {
            index = Array.prototype.indexOf.call(videos, vidItem);
            vidCounter[0].innerHTML = index + 1;
        }

        if (this.iOS) {
            event.target.cueVideoById(thisytid);
        } else {
            event.target.loadVideoById(thisytid);
        }

        this.scrollToVideo(plElement);
    }

    playerStateChange(event, context) {
        var videoData = event.target.getIframe(),
            key = videoData.id,
            current = context.ytPlayers[key].getElementsByClassName('active')[0],
            nextVid;

        // if playing...
        if (event.data == 1) {
            Helper.addClass(current, 'playing');
        } else {
            Helper.removeClass(current, 'playing');
        }

        // if video finishes, auto-progress to next video...
        if (event.data == 0) {
            nextVid = current.nextElementSibling;
            if (nextVid && Helper.hasClass(nextVid, 'video-item')) {
                context.selectVideo(event, nextVid, context.ytPlayers[key]);
            }
        }
    }

    scrollToVideo(vidObj) {
        var vidPos = vidObj.getBoundingClientRect(),
            doc = document.documentElement,
            top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
            header = document.getElementsByTagName('header')[0],
            diff;

        if (vidPos.top - 15 < 0) {
            diff = parseInt((header.offsetHeight + 15) - vidPos.top) * -1;
            window.scrollBy(0, diff);
        }
    }
};

export default Playlist;
