/*global document,window, init, require, class*/
/*jshint -W032 */ /* ignore unnecessary semicolon */
var Helper = require('./Helper');
var youtube = require('youtube-iframe-player');

class Playlist {
    constructor() {
        var _this = this,
            toggles,
            i;
        this.header = document.getElementsByClassName('playlist-info');
        this.plElems = document.getElementsByClassName('playlist');
        this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        toggles = document.getElementsByClassName('playlist-toggle');

        for (i = 0; i < this.header.length; i++) {
            this.header[i].addEventListener(
                'click',
                function() {
                    _this.toggle(this.parentNode.parentNode);
                },
                false
            );
        }
        for (i = 0; i < toggles.length; i++) {
            toggles[i].addEventListener(
                'click',
                function() {
                    _this.toggle(this.parentNode.parentNode);
                },
                false
            );
        }
    }

    toggle(list) {
        if (Helper.hasClass(list, 'open-playlist')) {
            Helper.removeClass(list, 'open-playlist');
        } else {
            Helper.addClass(list, 'open-playlist');
        }
    }

    loadYTPlayer() {
        var _this = this;

        if (document.getElementsByClassName('ytPlayer').length) {
            youtube.init(function() {
                _this.loadYTPlayers();
            });
        }
    }

    loadYTPlayers() {
        var ytPlayer,
            videoList,
            ytid,
            isPlaylist,
            isCustomList,
            youtubePlayer,
            vidObj,
            paramObj,
            i,
            _this = this;

        for (i = 0; i < this.plElems.length; i++) {
            ytPlayer = this.plElems[i].getElementsByClassName('ytPlayer')[0];
            videoList = this.plElems[i].getElementsByClassName('videos');
            ytid = (ytPlayer.dataset) ?
                ytPlayer.dataset.ytid :
                ytPlayer.getAttribute('data-ytid');
            isPlaylist = (ytPlayer.hasAttribute('data-playlist'));
            isCustomList = (videoList.length);
            vidObj = {
                width: '560',
                height: '315'
            };
            paramObj = {
                'autoplay': 0,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'wmode': 'opaque'
            };

            if (!isPlaylist) {
                vidObj.videoId = ytid;
            } else {
                paramObj.listType = 'playlist';
                paramObj.list = ytid;
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
                paramObj.showinfo = 0;
            }
            vidObj.playerVars = paramObj;

            ytPlayer.setAttribute('id', 'ytPlayer' + i);
            youtubePlayer = youtube.createPlayer('ytPlayer' + i, vidObj);
        }
    }

    playerReady(event, context) {
        var videoData = event.target.getIframe(),
            key = parseInt(videoData.id.substr(8)),
            videos = context.plElems[key].querySelectorAll(
                '.videos .video-item');

        Helper.addClass(context.plElems[key], 'playlist-ready');

        [].map.call(videos, function(elem) {
            elem.addEventListener('click', function() {
                if (!Helper.hasClass(this, 'active')) {
                    context.selectVideo(event, this, context.plElems[key]);
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
            key = parseInt(videoData.id.substr(8)),
            current = context.plElems[key].getElementsByClassName('active')[0],
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
                context.selectVideo(event, nextVid, context.plElems[key]);
            }
        }
    }

    scrollToVideo(vidObj) {
        var vidPos = vidObj.getBoundingClientRect(),
            doc = document.documentElement,
            top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0),
            header = document.getElementsByTagName('header')[0],
            diff;

        if (vidPos.top - 15 < 0) {
            diff = parseInt((header.offsetHeight + 15) - vidPos.top) * -1;
            window.scrollBy(0, diff);
        }
    }
};

export default Playlist;
