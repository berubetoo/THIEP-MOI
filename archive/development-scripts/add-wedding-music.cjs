const fs=require('fs');const p='thiep-moi-dam-cuoi.html';let h=fs.readFileSync(p,'utf8');
if(h.includes('id="weddingMusic"'))throw Error('Music control already exists');
const music=fs.readFileSync('wedding-background-music.mp3').toString('base64');
const markup=`<audio id="weddingMusic" preload="none" loop src="data:audio/mpeg;base64,${music}"></audio>
<button id="musicToggle" class="music-toggle" type="button" aria-label="Phát nhạc" aria-pressed="false" aria-controls="weddingMusic" title="Phát nhạc">
 <span class="music-record" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#26321c"/><g stroke="#b5bca0" stroke-opacity=".26"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="16"/></g><circle cx="32" cy="32" r="10" fill="#e6e5d4"/><path d="M32 37s-7-4.4-7-8a3.7 3.7 0 0 1 7-1.6 3.7 3.7 0 0 1 7 1.6c0 3.6-7 8-7 8Z" fill="#456b3a"/><circle cx="32" cy="32" r="1.5" fill="#26321c"/></svg></span>
 <span class="music-indicator" aria-hidden="true"><svg class="music-play-icon" viewBox="0 0 16 16"><path d="m5 3 8 5-8 5Z" fill="currentColor"/></svg><svg class="music-pause-icon" viewBox="0 0 16 16"><path d="M4 3h3v10H4zm5 0h3v10H9z" fill="currentColor"/></svg></span>
</button><span id="musicStatus" class="music-status" role="status" aria-live="polite"></span>`;
h=h.replace('</main>','</main>\n'+markup);
const css=`
/* Đĩa nhạc cố định, dùng cả PC và điện thoại; chỉ phát sau khi bấm. */
.music-toggle{position:fixed;left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));z-index:6;width:58px;height:58px;padding:4px;border:1px solid #456b3a33;border-radius:50%;background:#f6f5f0;box-shadow:0 3px 16px #17291f25;cursor:pointer;color:#456b3a;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:box-shadow .2s}
.music-toggle:hover{box-shadow:0 4px 22px #17291f40}.music-toggle:focus-visible{outline:2px solid #456b3a;outline-offset:4px}.music-record{display:block;width:100%;height:100%;animation:musicDiscSpin 9s linear infinite;animation-play-state:paused}.music-record svg{display:block;width:100%;height:100%}.music-toggle.is-playing .music-record{animation-play-state:running}
.music-indicator{position:absolute;right:-2px;bottom:-2px;width:22px;height:22px;border:1px solid #456b3a33;border-radius:50%;background:#f6f5f0;display:grid;place-items:center}.music-indicator svg{width:14px;height:14px;display:block}.music-toggle .music-pause-icon{display:none}.music-toggle[aria-pressed=true] .music-play-icon{display:none}.music-toggle[aria-pressed=true] .music-pause-icon{display:block}.music-status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@keyframes musicDiscSpin{to{transform:rotate(360deg)}}
@media(min-width:1024px){.music-toggle{left:26px;bottom:26px;width:66px;height:66px}.music-indicator{width:24px;height:24px}}
`;
h=h.replace('</style>',css+'</style>');
const script=`
// Nhạc được nhúng để giữ file HTML dùng được offline.
const weddingMusic=document.getElementById('weddingMusic');
const musicToggle=document.getElementById('musicToggle');
const musicStatus=document.getElementById('musicStatus');
let musicWanted=false,musicRequest=0;
weddingMusic.volume=.55;
function syncMusicControl(){const active=!weddingMusic.paused&&!weddingMusic.ended;musicToggle.setAttribute('aria-pressed',String(active));musicToggle.setAttribute('aria-label',active?'Tắt nhạc':'Phát nhạc');musicToggle.title=active?'Tắt nhạc':'Phát nhạc';if(!active)musicToggle.classList.remove('is-playing')}
weddingMusic.addEventListener('play',syncMusicControl);
weddingMusic.addEventListener('playing',()=>{syncMusicControl();musicToggle.classList.add('is-playing')});
['pause','ended'].forEach(name=>weddingMusic.addEventListener(name,()=>{musicWanted=false;syncMusicControl()}));
['waiting','stalled'].forEach(name=>weddingMusic.addEventListener(name,()=>musicToggle.classList.remove('is-playing')));
weddingMusic.addEventListener('error',()=>{musicWanted=false;musicToggle.classList.remove('is-playing');weddingMusic.pause();syncMusicControl();musicStatus.textContent='Chưa phát được nhạc. Bạn bấm lại để thử nhé.'});
musicToggle.addEventListener('click',async()=>{
  musicWanted=!musicWanted;const request=++musicRequest;musicStatus.textContent='';
  if(!musicWanted){weddingMusic.pause();syncMusicControl();return}
  try{await weddingMusic.play()}catch(error){if(request!==musicRequest)return;musicWanted=false;weddingMusic.pause();syncMusicControl();musicStatus.textContent='Chưa phát được nhạc. Bạn bấm lại để thử nhé.'}
});
`;
h=h.replace('</script>',script+'</script>');
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);fs.writeFileSync(p,h);fs.copyFileSync(p,'wedding-deploy/wedding/index.html');console.log('Embedded MP3 and fixed bottom-left spinning disc; click-only play/pause.');
