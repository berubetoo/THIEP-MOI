const fs=require('fs');const path='thiep-moi-dam-cuoi.html';let h=fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n');
const oldStyles=`background-color:#f6f5f0;
background-image:linear-gradient(rgba(246,245,240,.76),rgba(246,245,240,.84)),var(--couple-watermark);
background-size:100% 100%,100% auto;
background-repeat:no-repeat;
background-position:center,center center;`;
if(!h.includes(oldStyles))throw Error('Current watermark style missing');
h=h.replace(oldStyles,`background-color:#f6f5f0;
background-image:none;`);
h=h.replace('<section class="formal paper botanical">','<section class="formal paper botanical"><div class="couple-shadow" aria-hidden="true"></div>');
h=h.replace('<section class="timeline-section paper botanical">','<section class="timeline-section paper botanical"><div class="couple-shadow" aria-hidden="true"></div>');
h=h.replace('<section class="rsvp paper botanical" id="rsvp">','<section class="rsvp paper botanical" id="rsvp"><div class="couple-shadow" aria-hidden="true"></div>');
const css=`
/* Hình cô dâu chú rể được dùng làm khuôn bóng một màu duy nhất. */
.wedding-page section>.couple-shadow{
  position:absolute;inset:0;z-index:0;pointer-events:none;
  background-color:var(--couple-shadow-color,#9f8266);opacity:.24;
  -webkit-mask-image:var(--couple-watermark);mask-image:var(--couple-watermark);
  -webkit-mask-size:100% auto;mask-size:100% auto;
  -webkit-mask-position:center;mask-position:center;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  mask-mode:alpha;
}
.wedding-page .rsvp>.couple-shadow{-webkit-mask-position:center 30%;mask-position:center 30%}
`;
h=h.replace('</style>',css+'</style>');
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);
fs.writeFileSync(path,h);fs.copyFileSync(path,'wedding-deploy/wedding/index.html');
console.log('Converted three displayed watermarks to single flat warm beige silhouettes; original images unchanged.');
