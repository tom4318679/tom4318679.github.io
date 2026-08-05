const root=document.documentElement;
const manifestUrl=root.dataset.eventsData||'./manifest.json';
const requestedDate=new URLSearchParams(location.search).get('date');
const state={category:'all',area:'all',status:'all',free:false,search:'',sort:'start'};
let events=[];
let selectedDate='';
let latestDate='';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const dateValue=v=>new Date(v+'T00:00:00+09:00').getTime();

function updateMetrics(){
  $('#metric-total').textContent=events.length;
  $('#metric-art').textContent=events.filter(e=>e.category==='art').length;
  $('#metric-anime').textContent=events.filter(e=>e.category==='anime').length;
  $('#metric-upcoming').textContent=events.filter(e=>e.status==='upcoming').length;
}

function populateAreas(){
  const select=$('#area');
  const areas=[...new Set(events.map(e=>e.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
  select.innerHTML='<option value="all">全部地區</option>'+areas.map(area=>`<option value="${esc(area)}">${esc(area)}</option>`).join('');
}

function card(e){
  return `<article class="card">
    <div class="card-top">
      <div class="badges"><span class="badge">${esc(e.categoryLabel)}</span><span class="badge ${esc(e.status)}">${esc(e.statusLabel)}</span></div>
      <span class="muted">${esc(e.area)}</span>
    </div>
    <h3>${esc(e.zh)}</h3>
    <div class="jp">${esc(e.title)}</div>
    <p class="desc">${esc(e.description)}</p>
    <dl class="meta">
      <dt>期間</dt><dd>${esc(e.period)}</dd>
      <dt>地點</dt><dd>${esc(e.venue)}</dd>
      <dt>交通</dt><dd>${esc(e.station)}</dd>
      <dt>費用</dt><dd>${esc(e.price)}</dd>
      <dt>預約</dt><dd>${esc(e.reservation)}</dd>
    </dl>
    <div class="links">
      <a class="link primary" href="${esc(e.official)}" target="_blank" rel="noopener noreferrer">官方網站 ↗</a>
      <a class="link secondary" href="${esc(e.reference)}" target="_blank" rel="noopener noreferrer">參考來源 ↗</a>
    </div>
  </article>`;
}

function render(){
  let result=events.filter(e=>{
    const hay=`${e.title} ${e.zh} ${e.description} ${e.area} ${e.venue} ${e.station}`.toLowerCase();
    return (state.category==='all'||e.category===state.category)
      &&(state.area==='all'||e.area===state.area)
      &&(state.status==='all'||e.status===state.status)
      &&(!state.free||e.free)
      &&(!state.search||hay.includes(state.search.toLowerCase()));
  });
  result.sort((a,b)=>state.sort==='end'
    ?dateValue(a.end)-dateValue(b.end)
    :state.sort==='area'
      ?a.area.localeCompare(b.area,'zh-Hant')
      :dateValue(a.start)-dateValue(b.start));
  $('#count').textContent=`顯示 ${result.length}／${events.length} 項`;
  $('#list').innerHTML=result.map(card).join('');
  $('#empty').style.display=result.length?'none':'block';
}

function bind(){
  $$('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    state.category=btn.dataset.category;
    $$('.tab').forEach(x=>x.classList.toggle('active',x===btn));
    render();
  }));
  $('#search').addEventListener('input',e=>{state.search=e.target.value.trim();render()});
  $('#area').addEventListener('change',e=>{state.area=e.target.value;render()});
  $('#status').addEventListener('change',e=>{state.status=e.target.value;render()});
  $('#free').addEventListener('change',e=>{state.free=e.target.checked;render()});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
}

async function loadJson(url){
  const res=await fetch(url,{cache:'no-store'});
  if(!res.ok)throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function init(){
  try{
    const manifest=await loadJson(manifestUrl);
    latestDate=manifest.latest;
    selectedDate=requestedDate&&manifest.dates.includes(requestedDate)?requestedDate:latestDate;
    const dataUrl=new URL(`./data/${selectedDate}.json`,location.href);
    const data=await loadJson(dataUrl);
    events=data.events||[];
    const archiveMode=selectedDate!==latestDate;
    $('#updated').textContent=`資料更新：${data.updated}`;
    $('#title').textContent=data.title+(archiveMode?`｜${selectedDate} 存檔`:'');
    document.title=$('#title').textContent;
    populateAreas();
    updateMetrics();
    bind();
    render();
  }catch(err){
    $('#list').innerHTML=`<div class="notice">資料載入失敗：${esc(err.message)}。請重新整理頁面。</div>`;
    $('#count').textContent='載入失敗';
  }
}

init();
