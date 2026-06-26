// Compatibility shim — import canonical extension implementation in this module
import './RichTextHooksExtension';

// Re-export the runtime handle for callers
window.RICH_TEXT_HOOKS = window.RICH_TEXT_HOOKS || {};
export default window.RICH_TEXT_HOOKS;
