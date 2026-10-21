const fs=require('fs');
const path='thiep-moi-dam-cuoi.html';let h=fs.readFileSync(path,'utf8');
const additions=`
/* Chữ và ảnh album chỉ hiện khi cuộn tới; phần mở đầu giữ tĩnh. */
.wedding-page .scroll-reveal{opacity:0;transform-origin:center center}
.wedding-page .scroll-reveal.revealed{animation:var(--scroll-effect,weddingFadeUp) var(--scroll-duration,1.55s) cubic-bezier(.2,.65,.25,1) var(--scroll-delay,0s) both}
.wedding-page .scroll-reveal.reveal-complete{opacity:1;transform:none;animation:none}
.wedding-page .scroll-reveal:is(em,small,label,time){display:block}
.wedding-page .scroll-reveal:focus-visible{opacity:1;transform:none;animation:none}
.wedding-page .couple-names{font-family:WeddingScript,WeddingVietnamese,cursive;font-size:46px;font-weight:400;font-style:normal;line-height:1.4;letter-spacing:0;margin:0 0 8px}
@keyframes weddingFadeDown{from{opacity:0;transform:translateY(-38px)}to{opacity:1;transform:translateY(0)}}
@keyframes weddingFadeUp{from{opacity:0;transform:translateY(38px)}to{opacity:1;transform:translateY(0)}}
@keyframes weddingFadeLeft{from{opacity:0;transform:translateX(-45px)}to{opacity:1;transform:translateX(0)}}
@keyframes weddingFadeRight{from{opacity:0;transform:translateX(45px)}to{opacity:1;transform:translateX(0)}}
@keyframes weddingFadeDownLeft{from{opacity:0;transform:translate(-35px,-35px)}to{opacity:1;transform:translate(0,0)}}
@keyframes weddingFadeDownRight{from{opacity:0;transform:translate(35px,-35px)}to{opacity:1;transform:translate(0,0)}}
@keyframes weddingFadeUpLeft{from{opacity:0;transform:translate(-35px,35px)}to{opacity:1;transform:translate(0,0)}}
@keyframes weddingFadeUpRight{from{opacity:0;transform:translate(35px,35px)}to{opacity:1;transform:translate(0,0)}}
@keyframes weddingSpinFade{from{opacity:0;transform:rotate(-360deg) scale(.86)}to{opacity:1;transform:rotate(0deg) scale(1)}}
@media(max-width:360px){.wedding-page .couple-names{font-size:40px}}
@media(prefers-reduced-motion:reduce){.wedding-page .scroll-reveal,.wedding-page .scroll-reveal.revealed{opacity:1;transform:none;animation:none}}
`;
// Replace previous reveal system rather than stacking container/child effects.
h=h.replace(/\sdata-reveal="[^"]*"/g,'').replace(/\sdata-duration="[^"]*"/g,'');
h=h.replace(/\.wedding-page \[data-reveal\]\{[\s\S]*?(?=@keyframes scrollHint)/,'');
h=h.replace('.wedding-page [data-reveal].revealed{animation-duration:.01s;animation-delay:0s}','');
h=h.replace('</style>',additions+'</style>');
const revealScript=`// Hiện chữ và ảnh album khi cuộn đến từng mục, không lồng hiệu ứng.
const revealRoot=document.getElementById('inside');
const revealPage=document.querySelector('.wedding-page');
const staticIntro='.photo-caption,.story>.serif,.story>p,.story>.stem';
const revealCandidates='h1,h2,h3,h4,p,label,input,textarea,select,button,small,.portrait-caption>em,.monogram,.ceremony-date>span,.ceremony-date>strong,.timeline time,.timeline span,.event-number,.countdown>div,.calendar>span,.wish-item>strong,.album-photo';
const scrollEffects=['weddingFadeDown','weddingFadeUp','weddingFadeLeft','weddingFadeRight','weddingFadeDownLeft','weddingFadeUpRight','weddingSpinFade','weddingFadeUpLeft','weddingFadeDownRight'];
const albumEffects=['weddingFadeUpLeft','weddingFadeDownRight','weddingFadeUpRight','weddingSpinFade','weddingFadeDownLeft','weddingFadeRight'];
const registeredReveals=new WeakSet();let scrollEffectIndex=0,albumEffectIndex=0;
const scrollMotionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
function showReveal(el){el.classList.add('revealed')}
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){showReveal(entry.target);revealObserver.unobserve(entry.target)}}),{root:revealRoot,threshold:.14,rootMargin:'0px 0px -32px 0px'}):null;
const dialogRevealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){showReveal(entry.target);dialogRevealObserver.unobserve(entry.target)}}),{threshold:.14}):null;
function registerScrollReveals(){
  const candidates=[...revealPage.querySelectorAll(revealCandidates)].filter(el=>!el.closest(staticIntro)&&!el.matches('.dialog-close')&&(el.matches('input,textarea,select,.album-photo')||el.textContent.trim()));
  const allCandidates=new Set(candidates);
  candidates.forEach(el=>{
    if(registeredReveals.has(el))return;
    for(let parent=el.parentElement;parent&&parent!==revealPage;parent=parent.parentElement){if(allCandidates.has(parent))return}
    registeredReveals.add(el);
    const isPhoto=el.matches('.album-photo');const effectIndex=isPhoto?albumEffectIndex++:scrollEffectIndex++;const effects=isPhoto?albumEffects:scrollEffects;const effect=effects[effectIndex%effects.length];
    el.style.setProperty('--scroll-effect',effect);el.style.setProperty('--scroll-duration',effect==='weddingSpinFade'?'2.2s':isPhoto?'1.8s':'1.55s');el.style.setProperty('--scroll-delay',(effectIndex%3*.09)+'s');
    const observer=el.closest('dialog')?dialogRevealObserver:revealObserver;
    if(!observer||scrollMotionQuery.matches)return;
    el.classList.add('scroll-reveal');observer.observe(el);
  });
}
revealPage.addEventListener('animationend',event=>{if(event.target.classList.contains('scroll-reveal'))event.target.classList.add('reveal-complete')});
revealPage.addEventListener('focusin',event=>{const el=event.target.closest('.scroll-reveal');if(el){showReveal(el);el.classList.add('reveal-complete')}});
let revealRegistrationQueued=false;
new MutationObserver(()=>{if(!revealRegistrationQueued){revealRegistrationQueued=true;queueMicrotask(()=>{revealRegistrationQueued=false;registerScrollReveals()})}}).observe(revealPage,{childList:true,subtree:true});
scrollMotionQuery.addEventListener('change',event=>{if(event.matches)revealPage.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.add('revealed','reveal-complete'))});
`;
h=h.replace(/\/\/ Animations déclenchées[\s\S]*?(?=const days=)/,revealScript);
// Keep countdown cells stable so ticking numbers do not restart their entrance animation.
const oldCountdown="document.getElementById('countdown').innerHTML=values.map((value,index)=>'<div><strong>'+String(value).padStart(2,'0')+'</strong><small>'+['NGÀY','GIỜ','PHÚT','GIÂY'][index]+'</small></div>').join('')";
const newCountdown="const countdown=document.getElementById('countdown');if(!countdown.children.length)countdown.innerHTML=['NGÀY','GIỜ','PHÚT','GIÂY'].map(label=>'<div><strong></strong><small>'+label+'</small></div>').join('');values.forEach((value,index)=>{const cell=countdown.children[index].querySelector('strong');const text=String(value).padStart(2,'0');if(cell.textContent!==text)cell.textContent=text})";
if(!h.includes(oldCountdown))throw Error('Countdown target missing');h=h.replace(oldCountdown,newCountdown);
h=h.replace('</script>','\nregisterScrollReveals();\n</script>');
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(path,h);fs.copyFileSync(path,'wedding-deploy/wedding/index.html');
console.log('Updated scroll text and album effects, static intro, full rotation, stable countdown, and calligraphy names.');
