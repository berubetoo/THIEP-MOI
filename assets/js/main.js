
const invitation=document.getElementById('invitation');
const doors=document.getElementById('doors');

function setOpen(open){invitation.classList.toggle('opened',open);}



// Cánh hoa nhẹ, vẽ trực tiếp để file vẫn hoạt động hoàn toàn offline.
const petalCanvas=document.getElementById('petals');
const petalContext=petalCanvas.getContext('2d');
let petalWidth=0,petalHeight=0,petalFrame=0,petalPrevious=0;
const petalColors=['#c62828','#e53935','#a91624','#ef5350'];
const petals=Array.from({length:12},()=>({x:Math.random(),y:-Math.random(),size:6+Math.random()*6,speed:25+Math.random()*26,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*1.4,sway:Math.random()*6}));
function resizePetals(){const box=invitation.getBoundingClientRect();petalWidth=box.width;petalHeight=box.height;const ratio=Math.min(window.devicePixelRatio||1,2);petalCanvas.width=Math.round(box.width*ratio);petalCanvas.height=Math.round(box.height*ratio);petalContext.setTransform(ratio,0,0,ratio,0,0);}
resizePetals();window.addEventListener('resize',resizePetals);
function drawPetals(time){
  petalFrame=0;
  if(!invitation.classList.contains('opened')||document.hidden){petalPrevious=0;petalContext.clearRect(0,0,petalWidth,petalHeight);return;}
  const step=petalPrevious?Math.min((time-petalPrevious)/1000,.05):0;petalPrevious=time;
  petalContext.clearRect(0,0,petalWidth,petalHeight);
  petals.forEach((petal,index)=>{
    petal.y+=petal.speed*step/petalHeight;petal.angle+=petal.spin*step;petal.sway+=step*.65;
    if(petal.y>1.04){petal.y=-.05;petal.x=Math.random();}
    petalContext.save();petalContext.translate(petal.x*petalWidth+Math.sin(petal.sway)*22,petal.y*petalHeight);petalContext.rotate(petal.angle);petalContext.scale(.55+Math.abs(Math.sin(petal.sway))*.45,1);petalContext.globalAlpha=.8+index%3*.08;petalContext.shadowColor="rgba(105,43,62,.22)";petalContext.shadowBlur=3;petalContext.shadowOffsetY=2;petalContext.fillStyle=petalColors[index%petalColors.length];
    petalContext.beginPath();petalContext.moveTo(0,-petal.size);petalContext.bezierCurveTo(petal.size*1.2,-petal.size*.35,petal.size*.8,petal.size*.8,0,petal.size);petalContext.bezierCurveTo(-petal.size*.8,petal.size*.4,-petal.size*.65,-petal.size*.6,0,-petal.size);petalContext.fill();petalContext.restore();
  });
  petalFrame=requestAnimationFrame(drawPetals);
}
function syncPetals(){if(invitation.classList.contains('opened')&&!document.hidden&&!petalFrame){petalPrevious=0;petalFrame=requestAnimationFrame(drawPetals);}}
new MutationObserver(syncPetals).observe(invitation,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',syncPetals);
// Tự mở khi trang và hình ảnh đã tải xong; chờ trình duyệt vẽ trạng thái đóng.
window.addEventListener('load',()=>{
  requestAnimationFrame(()=>requestAnimationFrame(()=>setOpen(true)));
},{once:true});

// Hiện chữ và ảnh album khi cuộn đến từng mục, không lồng hiệu ứng.
const revealRoot=document.getElementById('inside');
const revealPage=document.querySelector('.wedding-page');
const staticIntro='.photo-caption,.story>.serif,.story>p,.story>.stem,.formal .formal-details,.formal .families,.formal>p,.formal>h3,.formal .ceremony-date,.formal>button,#countdown,.calendar-section .month,#calendar,.memories>p,.photo-collections>p,#morePhotos,#wishForm,#giftButton,#rsvp,.pc-ceremony,.desktop-gifts,.pc-wish-examples,#pcWriteWish,.dress-note,.dress-event,.quote-signature';
const revealCandidates='h1,h2,h3,h4,p,label,input,textarea,select,button,small,.portrait-caption>em,.monogram,.ceremony-date>span,.ceremony-date>strong,.timeline time,.timeline span,.event-number,.countdown>div,.calendar>span,.wish-item>strong,.album-photo,.event-cards';
const scrollEffects=['weddingFadeDown','weddingFadeUp','weddingFadeLeft','weddingFadeRight','weddingFadeDownLeft','weddingFadeUpRight','weddingSpinFade','weddingFadeUpLeft','weddingFadeDownRight'];
const albumEffects=['weddingFadeUpLeft','weddingFadeDownRight','weddingFadeUpRight','weddingSpinFade','weddingFadeDownLeft','weddingFadeRight'];
const registeredReveals=new WeakSet();let scrollEffectIndex=0,albumEffectIndex=0;
const revealStates=new WeakMap(),revealItems=new Set();
const revealTransforms={weddingFadeDown:'translateY(-38px)',weddingFadeUp:'translateY(38px)',weddingFadeLeft:'translateX(-45px)',weddingFadeRight:'translateX(45px)',weddingFadeDownLeft:'translate(-35px,-35px)',weddingFadeDownRight:'translate(35px,-35px)',weddingFadeUpLeft:'translate(-35px,35px)',weddingFadeUpRight:'translate(35px,35px)',weddingSpinFade:'rotate(-360deg) scale(.86)',weddingFadeOnly:'none'};
let revealFrame=0,lastRevealScroll=revealRoot.scrollTop,revealDirection=1;
function finishReveal(el,state,visible){
  const animation=state.animation;state.animation=null;if(animation){animation.onfinish=null;animation.cancel()}
  state.phase=visible?'visible':'hidden';el.dataset.scrollPhase=state.phase;
  el.classList.remove('reveal-entering','reveal-exiting');el.classList.toggle('revealed',visible);el.classList.toggle('reveal-complete',visible);
}
function transitionReveal(el,visible,immediate=false){
  const state=revealStates.get(el);if(!state)return;
  if(immediate||typeof el.animate!=='function'){finishReveal(el,state,visible);return}
  if(visible&&(state.phase==='entering'||state.phase==='visible')||!visible&&(state.phase==='exiting'||state.phase==='hidden'))return;
  state.phase=visible?'entering':'exiting';el.dataset.scrollPhase=state.phase;
  el.classList.remove('reveal-complete');el.classList.add('revealed');el.classList.toggle('reveal-entering',visible);el.classList.toggle('reveal-exiting',!visible);
  if(state.animation){
    // Đảo trực tiếp animation đang chạy để không nhảy vị trí/độ trong suốt.
    state.animation.reverse();return;
  }
  const transform=revealTransforms[el.style.getPropertyValue('--scroll-effect')]||revealTransforms.weddingFadeUp;
  const entranceMs=parseFloat(el.style.getPropertyValue('--scroll-duration'))*1000||2200;
  const duration=visible?entranceMs:Math.min(1300,entranceMs*.6);
  const animation=el.animate([{opacity:0,transform},{opacity:state.restOpacity??1,transform:'none'}],{duration,easing:'cubic-bezier(.25,.1,.25,1)',fill:'both'});
  state.animation=animation;
  animation.onfinish=()=>{if(state.animation===animation)finishReveal(el,state,state.phase==='entering')};
  if(!visible){animation.currentTime=duration;animation.reverse()}
}
function showReveal(el){transitionReveal(el,true)}
function updateScrollReveal(entry){
  if(entry.target.closest('dialog'))transitionReveal(entry.target,entry.isIntersecting);
  else scheduleRevealPositions();
}
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(updateScrollReveal),{root:revealRoot,threshold:0,rootMargin:'0px 0px -48px 0px'}):null;
const dialogRevealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(updateScrollReveal),{threshold:0}):null;
function revealLayoutBox(el){
  let top=el.offsetTop,parent=el.offsetParent;
  while(parent&&parent!==revealRoot){top+=parent.offsetTop;parent=parent.offsetParent}
  if(parent!==revealRoot){const box=el.getBoundingClientRect(),rootBox=revealRoot.getBoundingClientRect();return{top:box.top-rootBox.top,height:box.height}}
  return{top:top-revealRoot.scrollTop,height:el.offsetHeight};
}
function shouldRevealBox(top,height,viewport,direction){
  const exitBand=Math.min(115,viewport*.17),entryBand=48;
  return direction>=0?top<viewport-entryBand&&top+height>exitBand:top+height>entryBand&&top<viewport-exitBand;
}
function updateRevealPositions(){
  revealFrame=0;const scroll=revealRoot.scrollTop,delta=scroll-lastRevealScroll;if(Math.abs(delta)>1)revealDirection=delta>0?1:-1;lastRevealScroll=scroll;
  const viewport=revealRoot.clientHeight;
  revealItems.forEach(el=>{
    if(!el.isConnected){revealItems.delete(el);return}
    if(el.closest('dialog'))return;
    if(!el.getClientRects().length){transitionReveal(el,false,true);return}
    const box=revealLayoutBox(el),bottom=box.top+box.height;
    if(bottom<=0||box.top>=viewport){transitionReveal(el,false,true);return}
    if(el.contains(document.activeElement)){transitionReveal(el,true,true);return}
    transitionReveal(el,shouldRevealBox(box.top,box.height,viewport,revealDirection));
  });
}
function scheduleRevealPositions(){if(!revealFrame)revealFrame=requestAnimationFrame(updateRevealPositions)}
function registerScrollReveals(){
  const candidates=[...revealPage.querySelectorAll(revealCandidates)].filter(el=>!el.closest(staticIntro)&&!el.matches('.dialog-close')&&(el.matches('input,textarea,select,.album-photo')||el.textContent.trim()));
  const allCandidates=new Set(candidates);
  candidates.forEach(el=>{
    if(registeredReveals.has(el))return;
    for(let parent=el.parentElement;parent&&parent!==revealPage;parent=parent.parentElement){if(allCandidates.has(parent))return}
    registeredReveals.add(el);
    const isPhoto=el.matches('.album-photo');const effectIndex=isPhoto?albumEffectIndex++:scrollEffectIndex++;const effects=isPhoto?albumEffects:scrollEffects;const effect=el.dataset.scrollEffect||effects[effectIndex%effects.length];
    el.style.setProperty('--scroll-effect',effect);el.style.setProperty('--scroll-duration',effect==='weddingSpinFade'?'3s':isPhoto?'2.6s':'2.2s');el.style.setProperty('--scroll-delay',el.dataset.scrollDelay||(effectIndex%3*.09)+'s');
    const observer=el.closest('dialog')?dialogRevealObserver:revealObserver;
    if(!observer)return;
    const restOpacity=Number.parseFloat(getComputedStyle(el).opacity);el.style.setProperty('--reveal-rest-opacity',String(Number.isFinite(restOpacity)?restOpacity:1));revealStates.set(el,{phase:'hidden',animation:null,restOpacity:Number.isFinite(restOpacity)?restOpacity:1});revealItems.add(el);el.dataset.scrollPhase='hidden';el.classList.add('scroll-reveal');observer.observe(el);
  });
  scheduleRevealPositions();
}
revealRoot.addEventListener('scroll',scheduleRevealPositions,{passive:true});window.addEventListener('resize',scheduleRevealPositions);
revealPage.addEventListener('focusin',event=>{const el=event.target.closest('.scroll-reveal');if(el)transitionReveal(el,true,true)});
let revealRegistrationQueued=false;
new MutationObserver(()=>{if(!revealRegistrationQueued){revealRegistrationQueued=true;queueMicrotask(()=>{revealRegistrationQueued=false;registerScrollReveals()})}}).observe(revealPage,{childList:true,subtree:true});
const days=['T2','T3','T4','T5','T6','T7','CN'];const calendar=document.getElementById('calendar');
days.forEach(day=>{const el=document.createElement('span');el.className='weekday';el.textContent=day;calendar.append(el)});
for(let i=0;i<6;i++)calendar.append(document.createElement('span'));
for(let day=1;day<=30;day++){const el=document.createElement('span');el.textContent=day;if(day===24){el.className='wedding-day';el.setAttribute('aria-label','24 tháng 11, ngày cưới')}calendar.append(el)}
function updateCountdown(){const total=Math.max(0,Math.floor((new Date('2026-11-24T10:30:00+07:00')-Date.now())/1000));const values=[Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];const countdown=document.getElementById('countdown');if(!countdown.children.length)countdown.innerHTML=['NGÀY','GIỜ','PHÚT','GIÂY'].map(label=>'<div><strong></strong><small>'+label+'</small></div>').join('');values.forEach((value,index)=>{const cell=countdown.children[index].querySelector('strong');const text=String(value).padStart(2,'0');if(cell.textContent!==text)cell.textContent=text})}
updateCountdown();setInterval(updateCountdown,1000);
document.querySelectorAll('[data-rsvp]').forEach(button=>button.addEventListener('click',()=>document.getElementById('rsvp').scrollIntoView({behavior:'smooth',block:'start'})));
document.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.event-card');const address=card?card.querySelectorAll('p')[1].textContent:'123 Nguyễn Văn Linh, Đà Nẵng';window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address),'_blank','noopener')}));
const morePhotos=document.getElementById('morePhotos');morePhotos.addEventListener('click',()=>{const album=document.getElementById('extraAlbum');album.hidden=!album.hidden;morePhotos.textContent=album.hidden?'XEM THÊM':'THU GỌN';morePhotos.closest('.memories').classList.toggle('album-expanded',!album.hidden)});
const photoDialog=document.getElementById('photoDialog');document.querySelectorAll('.album-photo').forEach(button=>button.addEventListener('click',()=>photoDialog.showModal()));
document.getElementById('giftButton').addEventListener('click',()=>document.getElementById('giftDialog').showModal());
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close()}})});
function readStored(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
const wishList=document.getElementById('wishList');let wishes=readStored('wedding-wishes-v1',[]);if(!Array.isArray(wishes))wishes=[];
function renderWishes(){wishList.replaceChildren();wishes.slice(-8).reverse().forEach(wish=>{const item=document.createElement('div');item.className='wish-item';const name=document.createElement('strong');name.textContent=wish.name;const message=document.createElement('p');message.textContent=wish.message;item.append(name,message);wishList.append(item)})}renderWishes();
document.getElementById('wishForm').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const name=form.elements.name.value.trim(),message=form.elements.message.value.trim();if(!name||!message)return;const newWishes=[...wishes,{name,message}].slice(-50);try{localStorage.setItem('wedding-wishes-v1',JSON.stringify(newWishes));wishes=newWishes;renderWishes();form.reset()}catch{wishList.textContent='Thiết bị không cho phép lưu. Bạn hãy thử lại.'}});
document.getElementById('rsvpForm').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const result=Object.fromEntries(new FormData(form));if(!result.name.trim())return;try{localStorage.setItem('wedding-rsvp-v1',JSON.stringify(result));document.getElementById('rsvpStatus').textContent='Đã lưu trên thiết bị này. Xác nhận chưa được gửi tới cô dâu chú rể.'}catch{document.getElementById('rsvpStatus').textContent='Thiết bị không cho phép lưu. Bạn hãy thử lại.'}});


document.querySelectorAll('[data-gift]').forEach(button=>button.addEventListener('click',()=>document.getElementById('giftDialog').showModal()));
document.getElementById('pcWriteWish').addEventListener('click',event=>{const section=document.querySelector('.guestbook');const open=section.classList.toggle('wish-form-open');event.currentTarget.setAttribute('aria-expanded',String(open));event.currentTarget.textContent=open?'Ẩn ô viết lời chúc':'✎  Viết lời chúc';if(open)document.getElementById('wishName').focus({preventScroll:true})});

registerScrollReveals();

// Nhạc được phục vụ từ tài nguyên local; chỉ phát khi người dùng bấm.
const weddingMusic=document.getElementById('weddingMusic');
const musicToggle=document.getElementById('musicToggle');
const musicStatus=document.getElementById('musicStatus');
let musicWanted=false,musicRequest=0;
weddingMusic.volume=.55;
function syncMusicControl(){const active=!weddingMusic.paused&&!weddingMusic.ended;musicToggle.setAttribute('aria-pressed',String(active));musicToggle.setAttribute('aria-label',active?'Tắt nhạc':'Phát nhạc');musicToggle.title=active?'Tắt nhạc':'Phát nhạc';if(!active)musicToggle.classList.remove('is-playing')}
weddingMusic.addEventListener('play',syncMusicControl);
weddingMusic.addEventListener('playing',()=>{syncMusicControl();musicToggle.classList.toggle('is-playing',!weddingMusic.paused&&!weddingMusic.ended)});
['pause','ended'].forEach(name=>weddingMusic.addEventListener(name,()=>{musicWanted=!weddingMusic.paused&&!weddingMusic.ended;syncMusicControl()}));
['waiting','stalled'].forEach(name=>weddingMusic.addEventListener(name,()=>musicToggle.classList.remove('is-playing')));
weddingMusic.addEventListener('error',()=>{musicWanted=false;musicToggle.classList.remove('is-playing');weddingMusic.pause();syncMusicControl();musicStatus.textContent='Chưa phát được nhạc. Bạn bấm lại để thử nhé.'});
musicToggle.addEventListener('click',async()=>{
  musicWanted=!musicWanted;const request=++musicRequest;musicStatus.textContent='';
  if(!musicWanted){weddingMusic.pause();syncMusicControl();return}
  try{await weddingMusic.play()}catch(error){if(request!==musicRequest)return;musicWanted=false;weddingMusic.pause();syncMusicControl();musicStatus.textContent='Chưa phát được nhạc. Bạn bấm lại để thử nhé.'}
});

