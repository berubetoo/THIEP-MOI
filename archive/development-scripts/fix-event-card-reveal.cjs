const fs=require('fs');let h=fs.readFileSync('thiep-moi-dam-cuoi.html','utf8');
h=h.replace(/<section class="events dark botanical">[\s\S]*?<\/section>/,block=>block.replace('<div class="event-card">','<div class="event-cards" data-scroll-effect="weddingFadeOnly" data-scroll-delay="0s"><div class="event-card">').replace('</section>','</div></section>'));
h=h.replace(".calendar>span,.wish-item>strong,.album-photo';", ".calendar>span,.wish-item>strong,.album-photo,.event-cards';");
h=h.replace('</style>','@keyframes weddingFadeOnly{from{opacity:0}to{opacity:1}}\n</style>');
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);fs.writeFileSync('thiep-moi-dam-cuoi.html',h);console.log('Event cards grouped into one opacity-only reveal.');
