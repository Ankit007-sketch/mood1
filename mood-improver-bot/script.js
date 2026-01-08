const DATA_PATH = './data.json';
let DATA = null;
let currentMoodKey = null;
let quoteIndex = 0;
let quoteTimer = null;

async function init(){
  showLastMood();
  try{
    const res = await fetch(DATA_PATH);
    DATA = await res.json();
  }catch(e){
    console.error('Failed to load data.json', e);
    alert('Failed to load data.json — check Live Server or fetch permissions.');
    return;
  }
  renderMoodGrid();
  const remembered = localStorage.getItem('moodKey');
  if(remembered && DATA.moods[remembered]){
    selectMood(remembered, true);
  }
  // Apply saved theme (dark by default)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  const tbtn = document.getElementById('themeToggle');
  if(tbtn) tbtn.addEventListener('click', toggleTheme);
}

function showLastMood(){
  const chip = document.getElementById('lastMoodChip');
  const key = localStorage.getItem('moodKey');
  chip.textContent = key ? `Remembered: ${key}` : 'Remembered: —';
}

function renderMoodGrid(){
  const grid = document.getElementById('moodGrid');
  grid.innerHTML = '';
  for(const key of Object.keys(DATA.moods)){
    const mood = DATA.moods[key];
    const card = document.createElement('button');
    card.className = 'mood-card';
    card.setAttribute('data-key', key);
    card.innerHTML = `<div class="mood-emoji">${mood.emoji}</div><div class="mood-name">${mood.name}</div>`;
    card.addEventListener('click', ()=>selectMood(key));
    grid.appendChild(card);
  }
}

function selectMood(key, silent=false){
  if(!DATA || !DATA.moods[key]) return;
  currentMoodKey = key;
  localStorage.setItem('moodKey', key);
  showLastMood();
  // animate selection
  const grid = document.getElementById('moodGrid');
  Array.from(grid.children).forEach(c=>c.style.opacity= c.getAttribute('data-key')===key? '1':'0.6');
  // reveal content
  const area = document.getElementById('contentArea');
  area.style.display = 'block';
  const mood = DATA.moods[key];
  document.getElementById('selectedMoodTitle').textContent = `${mood.emoji} ${mood.name}`;
  document.getElementById('selectedMoodSubtitle').textContent = `${mood.songs.length} songs • ${mood.quotes.length} quotes`;
  renderSongs(mood.songs);
  startQuotesCarousel(mood.quotes);
  if(!silent) window.scrollTo({top: area.getBoundingClientRect().top + window.scrollY - 40, behavior:'smooth'});
}

function renderSongs(songs){
  const wrap = document.getElementById('songs');
  wrap.innerHTML = '';
  songs.forEach(s=>{
    const el = document.createElement('div');
    el.className = 'song-card';
    const yt = extractYoutubeId(s.url);
    el.innerHTML = `<div class="play-btn" data-url="${yt ? 'https://www.youtube.com/embed/'+yt+'?autoplay=1' : s.url}">▶</div><div class="song-meta"><div class="font-semibold">${s.title}</div><div class="text-sm opacity-80">${s.artist}</div></div>`;
    el.querySelector('.play-btn').addEventListener('click', (e)=>openPlayer(e.target.getAttribute('data-url')));
    wrap.appendChild(el);
  });
}

function extractYoutubeId(url){
  try{
    const u = new URL(url);
    if(u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
  }catch(e){/*not a url*/}
  return null;
}

function openPlayer(src){
  const modal = document.getElementById('modal');
  const frame = document.getElementById('playerFrame');
  frame.src = src;
  modal.style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', ()=>{
  const modal = document.getElementById('modal');
  const frame = document.getElementById('playerFrame');
  frame.src = '';
  modal.style.display = 'none';
});

document.getElementById('resetBtn').addEventListener('click', ()=>{
  localStorage.removeItem('moodKey');
  showLastMood();
  document.getElementById('contentArea').style.display = 'none';
  document.getElementById('moodGrid').querySelectorAll('.mood-card').forEach(c=>c.style.opacity='1');
});

document.getElementById('shareBtn').addEventListener('click', ()=>{
  if(!currentMoodKey) return alert('Select a mood first');
  const mood = DATA.moods[currentMoodKey];
  const u = encodeURIComponent(`Check out how ${mood.name} mood feels — ${location.href}`);
  const tw = `https://twitter.com/intent/tweet?text=${u}`;
  window.open(tw,'_blank');
});

function startQuotesCarousel(quotes){
  if(quoteTimer) clearInterval(quoteTimer);
  quoteIndex = 0;
  const el = document.getElementById('quoteText');
  function show(){
    const txt = quotes[quoteIndex % quotes.length];
    typeText(el, txt);
    quoteIndex++;
  }
  show();
  quoteTimer = setInterval(show, 4500);
}

function typeText(el, text){
  el.textContent = '';
  let i = 0;
  const id = setInterval(()=>{
    el.textContent += text[i++] || '';
    if(i>text.length) clearInterval(id);
  }, 28);
}

// PWA: register service worker with proper scope for subdirectory
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js', {scope: './'}).catch(e=>console.warn('SW failed', e));
  });
}

window.addEventListener('DOMContentLoaded', init);

// Theme helpers
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if(btn) btn.textContent = theme === 'light' ? '🌞' : '🌙';
}

function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'light' ? 'dark' : 'light';
  // add a short transition class for smooth switching
  document.documentElement.classList.add('light-transition');
  // spin the toggle button
  const btn = document.getElementById('themeToggle');
  if(btn) btn.classList.add('spinning');
  // flash the background
  document.body.classList.add('theme-flash');
  localStorage.setItem('theme', next);
  applyTheme(next);
  setTimeout(()=>{
    document.documentElement.classList.remove('light-transition');
    if(btn) btn.classList.remove('spinning');
    document.body.classList.remove('theme-flash');
  }, 500);
}
