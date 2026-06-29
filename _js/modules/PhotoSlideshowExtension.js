// Extension: augment core PhotoSlideshow with accessibility behaviors and debug logs
(function () {
  'use strict';

  const POLL_INTERVAL = 250;

  function setCaptionToggleAccessibility(ss) {
    if (!ss || !ss.el) return;
    const captionToggle = ss.el.querySelector('.image-caption-button');
    if (!captionToggle) return;

    // debug logs removed
    captionToggle.setAttribute('role', 'button');
    captionToggle.setAttribute('aria-pressed', String(captionToggle.classList.contains('on')));
    captionToggle.tabIndex = 0;

    function syncAria() {
      // debug logs removed
      captionToggle.setAttribute('aria-pressed', String(captionToggle.classList.contains('on')));
      // reflect aria-expanded on the button if caption element exists
      const captionId = captionToggle.getAttribute('aria-controls');
      if (captionId) {
        const captionEl = document.getElementById(captionId);
        if (captionEl) captionEl.setAttribute('aria-hidden', String(!captionToggle.classList.contains('on')));
      }
    }

    captionToggle.addEventListener('click', function () {
      syncAria();
    });

    captionToggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        captionToggle.click();
      }
    });
  }

  function setFigureTabindex(ss) {
    if (!ss || !ss.el) return;
    const figs = ss.el.querySelectorAll('figure');
    figs.forEach(f => {
      if (!f.hasAttribute('tabindex')) {
        f.setAttribute('tabindex', '-1');
      }
    });
  }

  function initForSlideshow(ss) {
    try {
      // console.log('PhotoSlideshowExtension.initForSlideshow for', ss && ss.el && ss.el.id);
      // init for slideshow (no debug logs)
      setCaptionToggleAccessibility(ss);
      setFigureTabindex(ss);
    } catch (err) {
      console.error('PhotoSlideshowExtension init error', err);
    }
  }

  function attach() {
    if (window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onSlideChange === 'function') {
      const origOnSlide = window.PHOTO_SLIDESHOW_HOOKS.onSlideChange;
      window.PHOTO_SLIDESHOW_HOOKS.onSlideChange = function (ss) {
        try { initForSlideshow(ss); } catch (e) {}
        return origOnSlide && origOnSlide(ss);
      };

      const origOnCaption = window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle;
      window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle = function (ss) {
        try { setCaptionToggleAccessibility(ss); } catch (e) {}
        return origOnCaption && origOnCaption(ss);
      };

      document.querySelectorAll('.photo-slideshow').forEach(root => {
        const ss = root.__photoSlideshowInstance || (window.__PHOTO_SLIDESHOW_INSTANCES && window.__PHOTO_SLIDESHOW_INSTANCES[root.id]) || null;
        if (ss) initForSlideshow(ss);
      });

      return true;
    }
    return false;
  }

  function waitAndAttach() {
    if (attach()) return;
    const id = setInterval(function () {
      if (attach()) clearInterval(id);
    }, POLL_INTERVAL);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    waitAndAttach();
  } else {
    document.addEventListener('DOMContentLoaded', waitAndAttach);
  }

  window.PHOTO_SLIDESHOW_EXTENSION = {
    initForSlideshow,
    setCaptionToggleAccessibility,
    setFigureTabindex
  };
  // console.log('PhotoSlideshowExtension registered');
})();
