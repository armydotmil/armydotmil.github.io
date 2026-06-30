// Hook implementation to sync ARIA and tabindex with PhotoSlideshow visual state
(function(){
  var SLIDE_FOCUSABLE = 'a.rich-text-img-link, .ss-move, .image-caption-button';

  function setFigureTabindex(figure, isCurrent){
    figure.querySelectorAll(SLIDE_FOCUSABLE).forEach(function(el){
      el.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });
  }

  function initSlideshowTabManagement(slideshow){
    try{
      var figures = slideshow.getElementsByClassName('photo');
      for(var i=0;i<figures.length;i++){
        setFigureTabindex(figures[i], figures[i].classList.contains('cur-photo'));
      }
    }catch(e){}
  }

  function syncCaptionAria(slideshow){
    try{
      var isOpen = slideshow.classList.contains('show-captions');
      var btns = slideshow.getElementsByClassName('image-caption-button');
      for(var i=0;i<btns.length;i++){
        var btn = btns[i];
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        var cid = btn.getAttribute('aria-controls');
        var cap = cid ? document.getElementById(cid) : null;
        if(cap){
          cap.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
          var links = cap.getElementsByTagName('a');
          for(var j=0;j<links.length;j++){ if(isOpen) links[j].removeAttribute('tabindex'); else links[j].setAttribute('tabindex','-1'); }
        }
      }
    }catch(e){}
  }

  function logFocusState(prefix){
    try{
      var ae = document.activeElement;
      // no-op: debug logging removed
    }catch(e){}
  }

  function initKeyActivation(slideshow){
    try{
      var captionBtns = slideshow.getElementsByClassName('image-caption-button');
      for(var i=0;i<captionBtns.length;i++){
        (function(btn){
          if(btn._psHookInit) return;
          btn._psHookInit = true;
          btn.addEventListener('keydown', function(e){
            var k = e.key || e.code;
            if(k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'Space'){
              e.preventDefault();
              logFocusState('caption-before');
              btn.click();
              setTimeout(function(){ logFocusState('caption-after'); }, 0);
            }
          });
        })(captionBtns[i]);
      }

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
                // ensure tab indices on all slides are correct for current slide
                try{ initSlideshowTabManagement(slideshow); }catch(e){}
                var isPrev = mv.classList.contains('ss-prev');
                var target = cur.querySelector(isPrev ? '.ss-prev' : '.ss-next');
                if(target){
                  try{ target.setAttribute('tabindex','0'); }catch(e){}
                  try{ target.focus(); }catch(e){}
                } else {
                  // If mover itself was focused, prefer focusing first logical element
                  try{
                    var first = cur.querySelector('a.rich-text-img-link, .image-caption-button, .ss-next, .ss-prev');
                    if(first){ try{ first.setAttribute && first.setAttribute('tabindex','0'); }catch(e){}; try{ first.focus && first.focus(); }catch(e){} }
                  }catch(e){}
                }
                logFocusState('move-after');
              },0);
            }
          });
        })(movers[i]);
      }
    }catch(e){}
  }

  // register hooks on global object
  window.PHOTO_SLIDESHOW_HOOKS = window.PHOTO_SLIDESHOW_HOOKS || {};
  window.PHOTO_SLIDESHOW_HOOKS.onSlideChange = function(slideshow){
    
    initSlideshowTabManagement(slideshow);
    initKeyActivation(slideshow);
  };
  window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle = function(slideshow){
    
    syncCaptionAria(slideshow);
    // Ensure focus remains on a live element within the slideshow after DOM/aria updates.
    // Some caption toggles replace or update nodes; refocusing the active element
    // prevents the tab order from getting stuck on a detached node.
    setTimeout(function(){
      try{
        var ae = document.activeElement;
        if(ae && slideshow.contains(ae)){
          try{ ae.setAttribute && ae.setAttribute('tabindex','0'); }catch(e){}
          try{ ae.focus(); }catch(e){}
        }
      }catch(e){}
    }, 0);
  };

  // Initialize existing slideshows on DOM ready
  function initAll(){
    var nodes = document.querySelectorAll('.photo-slideshow');
    // initAll
    // initAll: initialize hooks for found slideshows
    for(var i=0;i<nodes.length;i++){
      // initializing slideshow
      initSlideshowTabManagement(nodes[i]);
      syncCaptionAria(nodes[i]);
      initKeyActivation(nodes[i]);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();

  // Fallback: delegated keydown handler to catch Enter/Space on .ss-move
  function delegatedMoverKeydown(e){
    var key = e.key || e.code;
    if(!(key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Space')) return;
    var mover = e.target.closest && e.target.closest('.ss-move');
    if(!mover) return;
    // if this mover was individually initialized (has its own key handler), skip delegated handling
    if(mover._psHookInit) return;
    // delegated mover keydown
    e.preventDefault();
    try{ var ev = new MouseEvent('click',{bubbles:true}); mover.dispatchEvent(ev); }catch(err){ if(typeof mover.click === 'function') mover.click(); }
    try{
      var slideshow = mover.closest && mover.closest('.photo-slideshow');
      if(slideshow && window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onSlideChange === 'function'){
        window.PHOTO_SLIDESHOW_HOOKS.onSlideChange(slideshow);
      }
    }catch(e){}
  }
  document.addEventListener('keydown', delegatedMoverKeydown, true);

  // Fallback: delegated click handler to activate movers and caption toggles
  function delegatedClickHandler(e){
    try{
      var mv = e.target.closest && e.target.closest('.ss-move');
      if(mv){
        // find slideshow root
        var slideshow = mv.closest && mv.closest('.photo-slideshow');
        if(!slideshow) return;
        // if wired instance exists, let root handler handle it by returning
        if(slideshow._psWired && slideshow.__photoSlideshowInstance) return;
        e.preventDefault();
        // perform move fallback
        try{
          var figs = slideshow.getElementsByClassName('photo');
          if(!figs || figs.length === 0) return;
          var curIndex = -1;
          for(var i=0;i<figs.length;i++){ if(figs[i].classList.contains('cur-photo')) { curIndex = i; break; } }
          if(curIndex === -1) curIndex = 0;
          var dir = mv.classList.contains('ss-prev') ? -1 : 1;
          var next = (curIndex + dir + figs.length) % figs.length;
          figs[curIndex].classList.remove('cur-photo');
          figs[next].classList.add('cur-photo');
          if(window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onSlideChange === 'function'){
            window.PHOTO_SLIDESHOW_HOOKS.onSlideChange(slideshow);
          }
        }catch(err){}
        return;
      }

      var cb = e.target.closest && e.target.closest('.image-caption-button');
      if(cb){
        var slideshow = cb.closest && cb.closest('.photo-slideshow');
        if(!slideshow) return;
        if(slideshow._psWired && slideshow.__photoSlideshowInstance) return;
        e.preventDefault();
        try{ slideshow.classList.toggle('show-captions'); }catch(err){}
        try{ if(window.PHOTO_SLIDESHOW_HOOKS && typeof window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle === 'function'){ window.PHOTO_SLIDESHOW_HOOKS.onCaptionToggle(slideshow); } }catch(err){}
        return;
      }
    }catch(e){}
  }
  document.addEventListener('click', delegatedClickHandler, true);

})();
