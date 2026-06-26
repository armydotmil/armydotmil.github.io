// Thin shim — load canonical PhotoSlideshow from submodule
import '../../../../armydotmil.github.io/_js/modules/PhotoSlideshow';

// Re-export a minimal handle for callers
window.PHOTO_SLIDESHOW_HOOKS = window.PHOTO_SLIDESHOW_HOOKS || {};
export default window.PHOTO_SLIDESHOW_HOOKS;
