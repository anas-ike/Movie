(() => {const input=document.querySelector('.search-form input[type="search"]');input?.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';input.blur();}});})();
