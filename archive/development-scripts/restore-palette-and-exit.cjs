const fs=require('fs');const p='thiep-moi-dam-cuoi.html';let h=fs.readFileSync(p,'utf8');
fs.copyFileSync(p,'thiep-moi-truoc-doi-mau-va-exit.html');
const css=`
/* Bảng màu PC dùng cùng màu của thiệp trên điện thoại. */
@media(min-width:1024px){
 :root{--pc-green:#456b3a;--pc-gold:#9ba88d;--pc-paper:#f6f5f0;--pc-body:#61705b}
 .invitation,.response-grid{background:#f6f5f0}.inside{scrollbar-color:#acb49b #f6f5f0}.inside::-webkit-scrollbar-thumb{background:#acb49b}
 .wedding-page .story,.wedding-page .pc-ceremony,.wedding-page .thank-you{background:#26321c;color:#fff}
 .quote-heart,.quote-signature{color:#e6e5d4}.families h3,.family-firstname,.timeline time,.wedding-page .dress-panel>h3,.memories>.script,.photo-collections>.eyebrow,.dress-event>span,.wedding-page .desktop-gifts>.script{color:#456b3a}
 .wedding-page .photo-caption .wedding-date{border-color:#ffffff55}.wedding-page .pc-ceremony>.ceremony-ghost{color:#e6e5d4;opacity:.045}
 .ceremony-tile{border-color:#e6e5d444}.ceremony-tile>strong,.pin-symbol{color:#e6e5d4}.ceremony-icon,.pc-map-button{background:#e6e5d4;color:#26321c}.pc-map-button:hover{background:#f6f5f0}
 .wedding-page .timeline-section,.dress-panel{background:#f6f5f0}.dress-panel{border-color:#a5b09a66;box-shadow:0 5px 12px #26321c10}.timeline:before{background:#456b3a55}.timeline>div:before{background:#456b3a;box-shadow:0 0 0 3px #f6f5f0}.dress-event{border-color:#456b3a22}
 .swatches{gap:20px}.swatches i:nth-child(n){display:block;background:var(--swatch)}.swatches i:nth-child(1):after{content:'KEM'}.swatches i:nth-child(2):after{content:'XANH SAGE'}.swatches i:nth-child(3):after{content:'XANH RÊU'}.swatches i:nth-child(4):after{content:'XÁM'}
 .response-grid>.rsvp{background:#f6f5f0!important;border-color:#a5b09a55}.response-grid .solid-button{background:#456b3a;color:#fff;border:1px solid #80946c}.response-grid input,.response-grid select,.response-grid textarea{background:#fff;color:#31472b;border-color:#8d9d8770}
 .wedding-page .response-grid>.guestbook{background:#26321c;color:#fff;padding:32px!important;border-radius:30px}
 .response-grid>.guestbook>.script,.response-grid>.guestbook>p,.response-grid>.guestbook label,.response-grid>.guestbook .pc-write-wish,.response-grid>.guestbook .pc-wish-examples blockquote,.response-grid>.guestbook .wish-item{color:#fff}
 .response-grid>.guestbook .pc-wish-examples blockquote,.response-grid>.guestbook .wish-item,.response-grid>.guestbook .pc-write-wish{border-color:#ffffff44;background:transparent}
 .response-grid>.guestbook .pc-wish-examples>small,.response-grid>.guestbook form>small{color:#ffffffb3}.response-grid>.guestbook .solid-button{background:#e6e5d4;color:#26321c}
 .pc-gift-cards>button{background:#f6f5f0;border-color:#a5b09a33}.pc-gift-icon{background:#e6e5d4;color:#456b3a}.pc-gift-cards small{color:#61705b}
 .thank-you>.script,.thank-you>.sign-off{color:#fff}.thank-you>p:not(.sign-off){color:#ffffffbf}.thank-you>.sign-off:after{background:#e6e5d455}
}
/* Animation được điều khiển để có thể chạy ngược mượt khi gần rời khung. */
.wedding-page .scroll-reveal.revealed{animation:none}
.wedding-page .scroll-reveal.reveal-entering,.wedding-page .scroll-reveal.reveal-exiting{will-change:transform,opacity}
`;
h=h.replace('</style>',css+'</style>');
const start=h.indexOf("const registeredReveals=new WeakSet();");const end=h.indexOf('const days=',start);
if(start<0||end<0)throw Error('Reveal block missing');
const logic=`const registeredReveals=new WeakSet();let scrollEffectIndex=0,albumEffectIndex=0;
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
  const previous=state.phase;state.phase=visible?'entering':'exiting';el.dataset.scrollPhase=state.phase;
  el.classList.remove('reveal-complete');el.classList.add('revealed');el.classList.toggle('reveal-entering',visible);el.classList.toggle('reveal-exiting',!visible);
  if(state.animation){
    // Đảo trực tiếp animation đang chạy để không nhảy vị trí/độ trong suốt.
    state.animation.reverse();return;
  }
  const transform=revealTransforms[el.style.getPropertyValue('--scroll-effect')]||revealTransforms.weddingFadeUp;
  const entranceMs=parseFloat(el.style.getPropertyValue('--scroll-duration'))*1000||2200;
  const duration=visible?entranceMs:Math.min(1300,entranceMs*.6);
  const animation=el.animate([{opacity:0,transform},{opacity:1,transform:'none'}],{duration,easing:'cubic-bezier(.25,.1,.25,1)',fill:'both'});
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
    revealStates.set(el,{phase:'hidden',animation:null});revealItems.add(el);el.dataset.scrollPhase='hidden';el.classList.add('scroll-reveal');observer.observe(el);
  });
  scheduleRevealPositions();
}
revealRoot.addEventListener('scroll',scheduleRevealPositions,{passive:true});window.addEventListener('resize',scheduleRevealPositions);
revealPage.addEventListener('focusin',event=>{const el=event.target.closest('.scroll-reveal');if(el)transitionReveal(el,true,true)});
let revealRegistrationQueued=false;
new MutationObserver(()=>{if(!revealRegistrationQueued){revealRegistrationQueued=true;queueMicrotask(()=>{revealRegistrationQueued=false;registerScrollReveals()})}}).observe(revealPage,{childList:true,subtree:true});
`;
h=h.slice(0,start)+logic+h.slice(end);
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);fs.writeFileSync(p,h);fs.copyFileSync(p,'wedding-deploy/wedding/index.html');console.log('Restored PC palette to mobile and added reversible entry/exit animations with edge bands.');
