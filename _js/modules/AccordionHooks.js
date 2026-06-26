// Compatibility entry: ensure AccordionHooks API is available by loading the extension
import './AccordionHooksExtension';

// expose a minimal object for other modules that expect it
window.ACCORDION_HOOKS = window.ACCORDION_HOOKS || {};
export default window.ACCORDION_HOOKS;
