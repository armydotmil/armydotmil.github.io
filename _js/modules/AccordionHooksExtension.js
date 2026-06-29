// Accordion accessibility extension — canonical implementation
(function(){
	function init(root){
		try{ console.debug('[ACCORDION HOOK] init called on', root||document); }catch(e){}
		(root || document).querySelectorAll('.accordion').forEach(function(ac, ai){
			ac.querySelectorAll('li').forEach(function(li, liIndex){
				var input = li.querySelector('input[type="checkbox"]');
				var label = li.querySelector('label');
				if(!input || !label) return;
				if(label._accordionHookInit) return;
				label._accordionHookInit = true;
				try{ console.debug('[ACCORDION HOOK] attaching handlers for label', label, 'input', input); }catch(e){}
				label.setAttribute('tabindex','0');
				label.setAttribute('role','button');
				if(!label.getAttribute('aria-controls')) label.setAttribute('aria-controls', input.id || '');
				label.setAttribute('aria-expanded', input.checked ? 'true' : 'false');
				input.addEventListener('change', function(){ label.setAttribute('aria-expanded', input.checked ? 'true' : 'false'); });
				// Handle Enter and Space reliably. Space activates on keyup in many browsers, so handle both.
				label.addEventListener('keydown', function(e){ var k = e.key || e.code; if(k==='Enter'){ e.preventDefault(); try{ input.checked = !input.checked; input.dispatchEvent(new Event('change',{bubbles:true})); }catch(err){ input.click(); } } });
				label.addEventListener('keyup', function(e){ var k = e.key || e.code; if(k===' ' || k==='Spacebar' || k==='Space' || k==='Space'){ e.preventDefault(); try{ input.checked = !input.checked; input.dispatchEvent(new Event('change',{bubbles:true})); }catch(err){ input.click(); } } });
			});
		});
	}

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ init(document); }); else init(document);

	try{
		var mo = new MutationObserver(function(mutations){
			mutations.forEach(function(m){
				m.addedNodes && m.addedNodes.forEach(function(node){
				try{ console.debug('[ACCORDION HOOK] mutation observer added node', node); }catch(e){}
					if(!(node instanceof Element)) return;
					if(node.classList && node.classList.contains('accordion')){
						init(node);
					} else {
						var found = node.querySelector && node.querySelector('.accordion');
						if(found) init(found);
					}
				});
			});
		});
		mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
	}catch(e){ }

	window.ACCORDION_HOOKS = window.ACCORDION_HOOKS || {};
	window.ACCORDION_HOOKS.init = init;

})();
