import Quill from 'quill';

import PhotoSlideshow from './PhotoSlideshow';
import YTPlaylist from './Playlist';

let InlineEmbed = Quill.import('blots/inline');
let BlockEmbed = Quill.import('blots/block/embed');

/**
 * ***********************************
 * Documents inline blot
 * ***********************************
 */
class DocumentLinkBlot extends InlineEmbed {
  static create(data) {
    let node = super.create(data);

    node.setAttribute('target', '_blank');
    node.setAttribute('href', data.url);
    node.setAttribute('title', data.title);

    return node;
  }
}
DocumentLinkBlot.blotName = 'documentlink';
DocumentLinkBlot.tagName = 'A';
DocumentLinkBlot.className = 'documentlink';

/**
 * ***********************************
 * Images embed blot
 * ***********************************
 */
class ImageBlot extends BlockEmbed {
  static create(data) {
    let node = super.create(data);
    
    data.forEach(ImageBlot.createImageNode.bind(null, node, data.length));

    return node;
  }

  static createImageNode(node, imgCount, imgData, index) {
    let curPhoto = (index === 0) ? ' cur-photo' : '',
      full = (imgCount % 2 !== 0 && index === 0) ? '-full' : '',
      imgPath = '', imgHtml = '', imgDiv,
      imgDesc = imgData.description ? imgData.description : '';

    imgDiv = document.createElement('figure');
    imgDiv.className = 'photo' + curPhoto;
    imgPath = imgData.url.replace('original.', 'size0'+full+'.').replace('army.mil-', 'size0'+full+'-army.mil-');

    // Slideshow/grid markup...
    imgHtml += '<span class="centered-image">';
    imgHtml += '<span class="img-container">';
    imgHtml += '<a class="rich-text-img-link" href="' + imgData.url + '" target="_blank">';
    imgHtml += '<img alt="' + (imgData.title ? imgData.title : imgDesc) + '" src="' + imgPath + '">';
    imgHtml += '</a>';
    // TODO: use responsive image with different widths...
    // imgHtml += '<img alt="' + img.title + '" src="' + imgPath + ';
    // imgHtml += ' sizes="(min-width: 640px) 640px" srcset="' + imgPath + ' 640w, ' + imgPath + ' 100w" class="resp-image">';
    
    imgHtml += '</span>';
    imgHtml += '</span>';
    imgHtml += '<figcaption>';
    imgHtml += '<span class="image-caption">';
    imgHtml += '<span class="caption-text">' + imgDesc;
    imgHtml += '<span class="caption-author"> (Photo Credit: ' + (imgData.artist ? imgData.artist : 'U.S. Army') + ')</span>';
    imgHtml += '</span>';
    imgHtml += '<a href="' + imgData.url + '" title="View original" target="_blank">VIEW ORIGINAL</a>';
    imgHtml += '</span>';
    imgHtml += '</figcaption>';
    imgDiv.innerHTML = imgHtml;
    node.appendChild(imgDiv);
  }

  format(name, value) {
    if (typeof value === 'object' && value.hasOwnProperty('viewtype')) {
      this.domNode.setAttribute('data-viewtype', value.viewtype);
    } else if (!this.domNode.hasAttribute('data-viewtype')) {
      // sets a default value
      this.domNode.setAttribute('data-viewtype', 'slideshow');
    }
    this.updateViewClasses();
  }

  updateViewClasses() {
    let viewtype = this.domNode.getAttribute('data-viewtype'),
      images = this.domNode.getElementsByClassName('photo'),
      len = images.length;

    if (len === 1) {
      this.domNode.classList.add('single');
    } else {
      this.domNode.classList.remove('single');
    }
    if (len > 1 && viewtype) {
      this.domNode.classList.add('photo-' + viewtype);
    }

    if (len > 1 && len % 2 !== 0) {
      this.domNode.classList.add('odd-number');
    }
    this.updatePhotoSlideshows();
  }

  updatePhotoSlideshows() {
    let ss = document.getElementsByClassName('photo-slideshow'), i;

    for (i = 0; i < ss.length; i++) {
      this.createSSMarkup(ss[i]);
    }
    // adds JS transitions and butten events for slideshows
    new PhotoSlideshow();
  }

  createSSMarkup(ss) {
    let photos = ss.getElementsByClassName('photo'), i;
    
    for (i = 0; i < photos.length; i++) {
      this.createPhotoMarkup(photos.length, photos[i], i);
    }
  }

  createPhotoMarkup(total, photo, index) {
    let imgCont = photo.getElementsByClassName('img-container'),
      img = photo.getElementsByTagName('img'),
      imgCaptCont = photo.getElementsByTagName('figcaption'),
      imgCapt = photo.getElementsByClassName('image-caption'),
      captHTML = '';

    if (imgCont.length > 0 && img.length > 0) {
      imgCont[0].innerHTML = img[0].outerHTML;
      imgCont[0].innerHTML += '<span class="ss-move ss-prev"><span class="ss-move-button"></span></span>';
      imgCont[0].innerHTML += '<span class="ss-move ss-next"><span class="ss-move-button"></span></span>';
      img[0].src = img[0].src.replace(/size0(-full)?/, 'size0-full');
    }

    if (imgCaptCont.length > 0 && imgCapt.length > 0) {
      captHTML = '<span class="image-count">' + (index + 1) + ' / ' + total + '</span>';
      captHTML += '<span class="image-caption-button">';
      captHTML += '<span class="caption-button-text caption-button-hide">Show Caption +</span>';
      captHTML += '<span class="caption-button-text caption-button-show">Hide Caption &ndash;</span>';
      captHTML += '</span>';
      captHTML += imgCapt[0].outerHTML;
      imgCaptCont[0].innerHTML = captHTML;
    }
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'DIV';
ImageBlot.className = 'editor-image';

/**
 * ***********************************
 * Videos embed blot
 * ***********************************
 */
class VideoBlot extends BlockEmbed {
  static create(data) {
    let node = super.create(data);
    
    data.forEach(VideoBlot.createVideoNode.bind(this, node));

    return node;
  }

  static createVideoNode(node, vidData) {
    let playlistCont,
      playlistEl,
      captionDiv;
      
    playlistCont = document.createElement('div');
    playlistEl = document.createElement('div');
    playlistCont.className = 'playlist-container collection-container';
    playlistEl.className = 'playlist';

    node.setAttribute('data-ytid', vidData.video);

    this.videoCreatePlayer(playlistEl, vidData);

    if (vidData.description && vidData.has_description) {
      captionDiv = document.createElement('div');
      captionDiv.className = 'media-caption';
      captionDiv.innerHTML = '<p>' + vidData.description + '</p>';
      playlistEl.appendChild(captionDiv);
    }
    playlistCont.appendChild(playlistEl);
    node.appendChild(playlistCont);
  }

  static videoCreatePlayer(node, vid) {
    let playlistHTML = this.getPlaylistHTML(vid);

    node.innerHTML += '<div class="playlist-player custom-playlist narrow">' +
      '<div class="video-player">' +
      '<div class="video-wrapper">' +
      '<div class="ytPlayer" data-ytid="' + vid.videos[0].video + '"></div>' +
      '</div>' +
      '</div>' +
      playlistHTML +
      '</div>';
  }

  static getPlaylistHTML(playlist) {
    let html = '';

    html += '<div class="playlist-panel">';
    html += '<div class="playlist-overlay"></div>';
    html += '<div class="playlist-toggle">';
    html += '<a href="#" title="Show videos playlist"><span></span></a>';
    html += '</div>';
    html += '<div class="playlist-info">';
    html += '<div class="table">';
    html += '<h5><a href="#" title="Hide videos playlist">' + playlist.title + '<span></span></a></h5>';
    html += '</div>';
    html += '</div>';
    if (playlist.videos.length > 0 && playlist.videos[0].video !== playlist.video) {
      html += '<div class="videos">';
      html += '<table>';
      html += '<tr><td class="filler"></td></tr>';
      html += this.getVideosHTML(playlist.videos);
      html += '</table>';
      html += '</div>';
    }
    html += '</div>';

    return html;
  }

  static getVideosHTML(videos) {
    let html = '',
      active = ' active',
      i = 1;

    videos.forEach(video => {
      html += '<tr data-ytid="' + video.video + '" class="video-item' + active + '">';
      html += '<td>';
      html += '<span class="v-position">' + i + '</span>';
      html += '<span class="v-play-icon"><span></span></span>';
      html += '</td>';
      html += '<td class="v-title">' + video.title + '</td>';
      html += '</tr>';
      
      i++;
      active = '';
    });

    return html;
  }

  // format(name, value) ...each property/value of attributes:{video:___}
  format() {
    let playlist = new YTPlaylist(this.domNode.parentNode);
    setTimeout(playlist.resetYTPlayer.bind(playlist), 0);
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'DIV';
VideoBlot.className = 'editor-video';

Quill.register(DocumentLinkBlot, true);
Quill.register(ImageBlot, true);
Quill.register(VideoBlot, true);



export default Quill;