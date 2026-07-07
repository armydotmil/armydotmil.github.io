// Hook implementation to sync ARIA and tabindex with PhotoSlideshow visual state
(function(){
  var SLIDE_FOCUSABLE = 'a.rich-text-img-link, .ss-move';

  function setFigureTabindex(figure, isCurrent){
    figure.querySelectorAll(SLIDE_FOCUSABLE).forEach(function(el){
      el.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });
  }

  function initSlideshowTabManagement(slideshow){
    if(!slideshow || !slideshow.getElementsByClassName) return;
    var figures = slideshow.getElementsByClassName('photo');
    for(var i=0;i<figures.length;i++){
      setFigureTabindex(figures[i], figures[i].classList.contains('cur-photo'));
    }
  }

  function logFocusState(prefix){
    var ae = document.activeElement;
  }

  function initKeyActivation(slideshow){
    if(!slideshow || !slideshow.getElementsByClassName) return;
    var movers = slideshow.getElementsByClassName('ss-move');
    for(var i=0;i<movers.length;i++){
      (function(mv){
        if(mv._psHookInit) return;
        mv._psHookInit = true;
        mv.addEventListener('keydown', function(e){
          var k = e.key || e.code;
          if(k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space'){
            e.preventDefault();
            logFocusState('move-before');
            try{ var ev = new MouseEvent('click',{bubbles:true}); mv.dispatchEvent(ev); }catch(err){ if(typeof mv.click === 'function') mv.click(); }
            setTimeout(function(){
              var cur = slideshow.querySelector('figure.photo.cur-photo');
              if(!cur) return;
              // Ensure tab indices stay aligned to current slide.
              initSlideshowTabManagement(slideshow);
              var isPrev = mv.classList.contains('ss-prev');
              var target = cur.querySelector(isPrev ? '.ss-prev' : '.ss-next');
              if(target){
                target.setAttribute('tabindex','0');
                if(typeof target.focus === 'function') target.focus();
              } else {
                // If mover itself was focused, prefer focusing first logical element.
                var first = cur.querySelector('a.rich-text-img-link, .ss-next, .ss-prev');
                if(first){
                  if(typeof first.setAttribute === 'function') first.setAttribute('tabindex','0');
                  if(typeof first.focus === 'function') first.focus();
                }
              }
              logFocusState('move-after');
            },0);
          }
        });
      })(movers[i]);
    }
  }

  // register hooks on global object
  window.PHOTO_SLIDESHOW_HOOKS = window.PHOTO_SLIDESHOW_HOOKS || {};
  window.PHOTO_SLIDESHOW_HOOKS.onSlideChange = function(slideshow){
    
    initSlideshowTabManagement(slideshow);
    initKeyActivation(slideshow);
  };

  // Initialize existing slideshows on DOM ready
  function initAll(){
    var nodes = document.querySelectorAll('.photo-slideshow');
    // initAll: initialize hooks for found slideshows
    for(var i=0;i<nodes.length;i++){
      // initializing slideshow
      initSlideshowTabManagement(nodes[i]);
      initKeyActivation(nodes[i]);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();

  // No delegated fallbacks — initialization is deterministic via QuillLoader event.

})();