const fs=require('fs');const p='thiep-moi-dam-cuoi.html';let h=fs.readFileSync(p,'utf8');
h=h.replace('<h2 class="script">Timeline</h2>','<h2 class="script" data-scroll-effect="weddingFadeDown">Timeline</h2>');
h=h.replace('<h3 class="script small">Dress code</h3>','<h3 class="script small" data-scroll-effect="weddingFadeUp">Dress code</h3>');
h=h.replace(/<div class="timeline">[\s\S]*?(?=<h3 class="script small")/,block=>block.replace(/<time>/g,'<time data-scroll-effect="weddingFadeLeft" data-scroll-delay="0s">').replace(/<span>/g,'<span data-scroll-effect="weddingFadeRight" data-scroll-delay="0s">'));
h=h.replace('const effect=effects[effectIndex%effects.length];','const effect=el.dataset.scrollEffect||effects[effectIndex%effects.length];');
h=h.replace("el.style.setProperty('--scroll-delay',(effectIndex%3*.09)+'s');","el.style.setProperty('--scroll-delay',el.dataset.scrollDelay||(effectIndex%3*.09)+'s');");
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);fs.writeFileSync(p,h);console.log('Timeline directions fixed.');
