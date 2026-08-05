(() => {
  'use strict';
  const state = { section: 'english', articleId: null, langMode: 'all', rate: 1 };
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arr = v => Array.isArray(v) ? v : [];
  const speakButton = (text, lang) => `<button class="speak" type="button" data-speak="${esc(text)}" data-speech-lang="${lang}" aria-label="播放：${esc(text)}">🔊</button>`;

  async function loadJSON(path){ const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(`${path}: HTTP ${r.status}`); return r.json(); }
  function issueFromQuery(manifest){ return new URLSearchParams(location.search).get('date') || manifest.latest; }

  function renderParagraphs(article){
    return arr(article.paragraphs).map((p,i)=>`<div class="tri paragraph-row">
      <div class="lang-block" data-lang="en"><h4>English ${i+1}</h4><p>${esc(p.en)} ${speakButton(p.en,'en-US')}</p></div>
      <div class="lang-block" data-lang="zh"><h4>繁體中文</h4><p>${esc(p.zh)}</p></div>
      <div class="lang-block" data-lang="ja"><h4>自然日文</h4><p>${esc(p.ja)} ${speakButton(p.ja,'ja-JP')}</p></div>
    </div>`).join('');
  }

  function renderVocabulary(items, lang){
    const isEn=lang==='en';
    const heads=isEn?['單字','詞性','IPA','中文','日文','文章用法']:['用語','讀音','中文','近義替換','語感／用法'];
    return `<div class="scroll"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${arr(items).map(v=>isEn?`<tr><td><strong>${esc(v.term)}</strong>${speakButton(v.term,'en-US')}</td><td>${esc(v.pos)}</td><td>${esc(v.ipa)}</td><td>${esc(v.zh)}</td><td>${esc(v.ja)}</td><td>${esc(v.usage)}</td></tr>`:`<tr><td><strong>${esc(v.term)}</strong>${speakButton(v.term,'ja-JP')}</td><td>${esc(v.reading)}</td><td>${esc(v.zh)}</td><td>${esc(v.synonym)}</td><td>${esc(v.nuance)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderPairs(items, lang){
    return `<div class="expression-grid">${arr(items).map(x=>`<div class="mini-card"><strong>${esc(x.term)}</strong>${speakButton(x.term,lang)}<p>${esc(x.explanation||x.zh||'')}</p>${x.example?`<p><em>${esc(x.example)}</em>${speakButton(x.example,lang)}</p>`:''}${x.note?`<p class="muted">${esc(x.note)}</p>`:''}</div>`).join('')}</div>`;
  }
  const renderDetails=(title,items)=>arr(items).map((x,i)=>`<details><summary>${esc(title)} ${i+1}｜${esc(x.title||x.question||'')}</summary><div>${x.body?esc(x.body):''}${x.answer?`<p><strong>答案：</strong>${esc(x.answer)}</p>`:''}</div></details>`).join('');

  function renderEnglish(a){
    return `<article class="article-card" id="${esc(a.id)}" data-section="english">
      <p class="eyebrow">English learning article</p><h2>${esc(a.title)}</h2>
      <div class="meta"><span class="badge">${esc(a.level)}</span><span class="badge type">${esc(a.contentType)}</span><span class="badge source">${esc(a.date)}</span><span class="badge">${esc(a.readingTime)}</span></div>
      <div class="why"><strong>選文理由：</strong>${esc(a.why)}</div>
      <p><strong>作者：</strong>${esc(a.author)}</p>
      <ul class="source-list">${arr(a.sources).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
      <section class="article-section"><h3>AI learning article</h3>${renderParagraphs(a)}</section>
      <section class="article-section"><h3>重要單字</h3>${renderVocabulary(a.vocabulary,'en')}</section>
      <section class="article-section"><h3>片語與固定搭配</h3>${renderPairs(a.phrases,'en-US')}</section>
      <section class="article-section"><h3>文法／長句拆解</h3>${renderDetails('拆解',a.grammar)}</section>
      <section class="article-section"><h3>商務／顧問表達</h3>${renderPairs(a.business,'en-US')}</section>
      <section class="article-section"><h3>理解與輸出</h3>${renderDetails('題目',a.quiz)}</section>
      <section class="article-section interpretation"><h3>繁中內容解讀</h3>${arr(a.interpretation).map(x=>`<p><strong>${esc(x.label)}：</strong>${esc(x.text)}</p>`).join('')}</section>
      <section class="article-section quality"><h3>來源品質卡與限制</h3><p>${esc(a.quality)}</p></section>
    </article>`;
  }

  function renderJapanese(a){
    return `<article class="article-card" id="${esc(a.id)}" data-section="japanese">
      <p class="eyebrow">日本語・深度学習</p><h2>${esc(a.title)}</h2>
      <div class="meta"><span class="badge">${esc(a.level)}</span><span class="badge type">${esc(a.contentType)}</span><span class="badge source">${esc(a.date)}</span><span class="badge">${esc(a.readingTime)}</span></div>
      <div class="why"><strong>選文理由：</strong>${esc(a.why)}</div><p><strong>作者：</strong>${esc(a.author)}</p>
      <ul class="source-list">${arr(a.sources).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
      <section class="article-section"><h3>AIオリジナル学習記事</h3>${arr(a.paragraphs).map((p,i)=>`<div class="lang-block" data-lang="ja"><h4>段落 ${i+1}</h4><p>${esc(p.ja)} ${speakButton(p.ja,'ja-JP')}</p></div>`).join('')}</section>
      <section class="article-section interpretation"><h3>繁中精準解說</h3>${arr(a.zhExplanation).map(x=>`<p>${esc(x)}</p>`).join('')}</section>
      <section class="article-section"><h3>高階用語</h3>${renderVocabulary(a.vocabulary,'ja')}</section>
      <section class="article-section"><h3>固定搭配與不自然用法</h3>${renderPairs(a.collocations,'ja-JP')}</section>
      <section class="article-section"><h3>長句拆解</h3>${renderDetails('拆解',a.grammar)}</section>
      <section class="article-section"><h3>コンサル表現</h3>${renderPairs(a.consulting,'ja-JP')}</section>
      <section class="article-section"><h3>要約訓練</h3>${renderDetails('要約',a.summaries)}</section>
      <section class="article-section"><h3>会話と雑談</h3>${renderPairs(a.conversation,'ja-JP')}</section>
      <section class="article-section"><h3>理解と口頭表現</h3>${renderDetails('問題',a.quiz)}</section>
      <section class="article-section quality"><h3>來源品質卡與限制</h3><p>${esc(a.quality)}</p></section>
    </article>`;
  }

  function showArticle(id){
    state.articleId=id; speechSynthesis?.cancel();
    $$('.article-card').forEach(x=>x.classList.toggle('active',x.id===id));
    $$('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.articleId===id));
    applyLangMode(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function applyLangMode(){
    $$('[data-lang]').forEach(x=>x.classList.toggle('hidden', state.langMode!=='all' && x.dataset.lang!==state.langMode));
  }
  function renderNav(data){
    const items=state.section==='english'?data.english:data.japanese;
    $('#articleNav').innerHTML=items.map(a=>`<button type="button" class="nav-item" data-article-id="${esc(a.id)}"><small>${esc(a.level)}</small>${esc(a.title)}</button>`).join('');
    $$('.nav-item').forEach(b=>b.addEventListener('click',()=>showArticle(b.dataset.articleId)));
    showArticle(items[0].id);
  }
  function switchSection(section,data){
    state.section=section; speechSynthesis?.cancel();
    $$('[data-section]').forEach(b=>{ if(b.tagName==='BUTTON') b.classList.toggle('active',b.dataset.section===section); });
    renderNav(data);
  }
  function setupSpeech(){
    if(!('speechSynthesis' in window)){ $('#speechNotice').hidden=false; $('#speechNotice').textContent='此裝置沒有可用的瀏覽器語音功能。'; return; }
    document.addEventListener('click',e=>{ const b=e.target.closest('[data-speak]'); if(!b)return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(b.dataset.speak); u.lang=b.dataset.speechLang||'en-US'; u.rate=state.rate; speechSynthesis.speak(u); });
    $('#normalSpeed').onclick=()=>{state.rate=1;$('#normalSpeed').classList.add('active');$('#slowSpeed').classList.remove('active')};
    $('#slowSpeed').onclick=()=>{state.rate=.72;$('#slowSpeed').classList.add('active');$('#normalSpeed').classList.remove('active')};
    $('#stopSpeech').onclick=()=>speechSynthesis.cancel();
  }

  async function init(){
    try{
      const manifest=await loadJSON('./manifest.json'); const issue=issueFromQuery(manifest); const data=await loadJSON(`./data/${issue}.json`);
      $('#issueLabel').textContent=`｜${data.dateLabel}`; $('#pageTitle').textContent=data.title; $('#pageIntro').textContent=data.intro;
      $('#content').innerHTML=data.english.map(renderEnglish).join('')+data.japanese.map(renderJapanese).join('');
      $('#archiveLinks').innerHTML=manifest.issues.map(x=>`<a href="?date=${encodeURIComponent(x.id)}">${esc(x.label)}</a>`).join('');
      $$('[data-section]').forEach(b=>b.addEventListener('click',()=>switchSection(b.dataset.section,data)));
      $$('[data-lang-mode]').forEach(b=>b.addEventListener('click',()=>{state.langMode=b.dataset.langMode;$$('[data-lang-mode]').forEach(x=>x.classList.toggle('active',x===b));applyLangMode()}));
      setupSpeech(); renderNav(data);
    }catch(err){ $('#content').innerHTML=`<article class="article-card active"><h2>載入失敗</h2><p>${esc(err.message)}</p></article>`; }
  }
  document.addEventListener('DOMContentLoaded',init);
})();
