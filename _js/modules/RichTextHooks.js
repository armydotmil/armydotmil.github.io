// RichText accessibility extension — ensure external links have rel and aria-label
(function(){
	function patchRichTextLinks(root){
		var doc = root || document;
		// target all anchors that open in a new window/tab
		var specific = doc.querySelectorAll('a[target="_blank"]');
		for(var i=0;i<specific.length;i++){
			var a = specific[i];
			try{ if(!a.getAttribute('rel')) a.setAttribute('rel','noopener'); }catch(e){}
			try{
				if(!a.getAttribute('aria-label')){
					var label = a.getAttribute('title') || (a.textContent||'').trim() || a.getAttribute('href') || 'Opens in a new window';
					if(label.indexOf('mailto:')===0) label = 'Opens email client';
					// Set a concise aria-label and append an inline sr-only hint inside the link
					a.setAttribute('aria-label', label);
					try{
						// Don't duplicate the sr-only span if present
						if(!a.querySelector('.sr-only')){
							var span = document.createElement('span');
							span.className = 'sr-only';
							span.textContent = ' (opens in a new window)';
							a.appendChild(span);
						}
					}catch(e){}
				}
			}catch(e){}
		}
	}

	if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ patchRichTextLinks(document); }); else patchRichTextLinks(document);

	window.RICH_TEXT_HOOKS = window.RICH_TEXT_HOOKS || {};
	window.RICH_TEXT_HOOKS.patch = patchRichTextLinks;

	if(window.MutationObserver){
		var obs = new MutationObserver(function(mutations){
			mutations.forEach(function(m){
				if(m.addedNodes && m.addedNodes.length){
					for(var i=0;i<m.addedNodes.length;i++){
						var n = m.addedNodes[i];
						if(n.nodeType===1) try{ patchRichTextLinks(n); }catch(e){}
					}
				}
			});
		});
		obs.observe(document.documentElement||document.body, { childList:true, subtree:true });
	}

})();

export default window.RICH_TEXT_HOOKS;
