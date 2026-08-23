(() => {
  'use strict';
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function loadJSON(path){ const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(`${path}: HTTP ${r.status}`); return r.json(); }
  async function init(){
    const list=document.querySelector('#historyList');
    try{
      const manifest=await loadJSON('../manifest.json');
      list.innerHTML=manifest.issues.map((x,i)=>{
        const href=x.href || `../?date=${encodeURIComponent(x.id)}`;
        const latest=x.id===manifest.latest ? '<span class="badge">Latest</span>' : '';
        const kind=x.kind==='legacy' ? '<span class="badge type">Legacy</span>' : x.kind==='preview' ? '<span class="badge type">Preview</span>' : '';
        const eyebrow=x.id===manifest.latest?'LATEST ISSUE':x.kind==='preview'?'PREVIEW':'ARCHIVE';
        return `<article class="article-card active history-item"><div><p class="eyebrow">${eyebrow}</p><h2><a href="${esc(href)}">${esc(x.label)}</a></h2><div class="meta">${latest}${kind}</div></div><a class="history-open" href="${esc(href)}">開啟 →</a></article>`;
      }).join('');
    }catch(err){ list.innerHTML=`<article class="article-card active"><h2>歷史列表載入失敗</h2><p>${esc(err.message)}</p></article>`; }
  }
  document.addEventListener('DOMContentLoaded',init);
})();
