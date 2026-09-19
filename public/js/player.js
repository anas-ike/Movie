<<<<<<< ours
(() => { const shell=document.querySelector('[data-watch-page]'); if(!shell)return; const iframe=shell.querySelector('[data-player-iframe]'), wrapper=shell.querySelector('.player-wrapper'); const origins=new Set((window.LIGHTSOUT_PROVIDER_ORIGINS||[]).map(p=>new URL(p.origin).origin)); const numeric=(v,max=100000)=>Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=max; iframe.addEventListener('load',()=>wrapper.classList.add('is-ready')); shell.querySelectorAll('[data-provider]').forEach(button=>button.addEventListener('click',async()=>{const provider=button.dataset.provider;wrapper.classList.remove('is-ready');try{const response=await fetch(`${shell.dataset.apiUrl}?provider=${encodeURIComponent(provider)}`,{headers:{Accept:'application/json'}});const json=await response.json();if(!response.ok||!json.success)throw new Error('Unable to load player');iframe.src=json.data.embedUrl;shell.querySelectorAll('[data-provider]').forEach(b=>b.classList.toggle('active',b===button));}catch{wrapper.classList.add('is-ready');}})); window.addEventListener('message',(event)=>{if(!origins.has(event.origin)||!event.data||typeof event.data!=='object')return;const d=event.data;if(d.type!=='PLAYER_EVENT'||Number(d.tmdbId)!==Number(shell.dataset.tmdbId)||d.mediaType!==shell.dataset.mediaType)return;if(shell.dataset.mediaType==='tv'&&(Number(d.season)!==Number(shell.dataset.season)||Number(d.episode)!==Number(shell.dataset.episode)))return;if(!numeric(d.progressSeconds)||!numeric(d.durationSeconds)||!numeric(d.progressPercent,100))return;window.dispatchEvent(new CustomEvent('lightsout:progress',{detail:d}));}); })();
=======
(() => {
  const shell = document.querySelector('[data-watch-page]');
  if (!shell) return;
  const iframe = shell.querySelector('[data-player-iframe]');
  const wrapper = shell.querySelector('.player-wrapper');
  const safeOrigin = () => { try { return new URL(iframe.src).origin; } catch { return null; } };
  const numeric = (value, max = 100000) => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= max;
  iframe.addEventListener('load', () => wrapper.classList.add('is-ready'));
  shell.querySelectorAll('[data-server]').forEach((button) => button.addEventListener('click', async () => {
    wrapper.classList.remove('is-ready');
    try {
      const response = await fetch(`${shell.dataset.apiUrl}?server=${encodeURIComponent(button.dataset.server)}`, { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error('The selected server is unavailable.');
      iframe.src = payload.data.embedUrl;
      shell.querySelectorAll('[data-server]').forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    } catch { wrapper.classList.add('is-ready'); const error = shell.querySelector('[data-player-error]'); if (error) error.hidden = false; }
  }));
  window.addEventListener('message', (event) => {
    if (event.origin !== safeOrigin() || !event.data || typeof event.data !== 'object') return;
    const data = event.data;
    if (data.type !== 'PLAYER_EVENT' || Number(data.tmdbId) !== Number(shell.dataset.tmdbId) || data.mediaType !== shell.dataset.mediaType) return;
    if (shell.dataset.mediaType === 'tv' && (Number(data.season) !== Number(shell.dataset.season) || Number(data.episode) !== Number(shell.dataset.episode))) return;
    if (!numeric(data.progressSeconds) || !numeric(data.durationSeconds) || !numeric(data.progressPercent, 100)) return;
    window.dispatchEvent(new CustomEvent('lightsout:progress', { detail: data }));
  });
})();
>>>>>>> theirs
