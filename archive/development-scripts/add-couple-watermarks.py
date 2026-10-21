from PIL import Image
from pathlib import Path
import base64
root=Path.cwd()
source=Path(r'C:/Users/Admin/.codex/generated_images/01a14f58-fb3f-7cc1-8815-10bc4e7b97aa')
items=[('foreheads','exec-50099e1e-9a9f-4ce8-8053-82a37a5ec23d.png'),('walking','exec-a3807b1f-9d04-4730-8d8b-f8d52990c9c8.png'),('embrace','exec-bba00f16-3924-413e-853a-4cf194384148.png')]
styles=[]
for label,name in items:
    with Image.open(source/name) as im:
        im.thumbnail((720,1080),Image.Resampling.LANCZOS)
        output=root/f'wedding-watermark-{label}.webp'
        im.save(output,'WEBP',quality=84,method=6)
    data=base64.b64encode(output.read_bytes()).decode('ascii')
    styles.append(f':root{{--watermark-{label}:url("data:image/webp;base64,{data}")}}')
styles.append('''
/* Ba dáng cô dâu chú rể làm hình nền mờ, không tác động tới chữ. */
.wedding-page .formal.paper,.wedding-page .timeline-section.paper,.wedding-page .rsvp.paper{
background-color:#f6f5f0;
background-image:linear-gradient(rgba(246,245,240,.76),rgba(246,245,240,.84)),var(--couple-watermark);
background-size:100% 100%,100% auto;
background-repeat:no-repeat;
background-position:center,center center;
}
.wedding-page .formal.paper{--couple-watermark:var(--watermark-walking)}
.wedding-page .timeline-section.paper{--couple-watermark:var(--watermark-foreheads)}
.wedding-page .rsvp.paper{--couple-watermark:var(--watermark-embrace);background-position:center,center 30%}
''')
path=root/'thiep-moi-dam-cuoi.html'
h=path.read_text(encoding='utf-8').replace('</style>','\n'.join(styles)+'</style>')
path.write_text(h,encoding='utf-8')
(root/'wedding-deploy/wedding/index.html').write_text(h,encoding='utf-8')
print('Embedded 3 transparent WebP background poses:',', '.join(f'{(root/f"wedding-watermark-{label}.webp").stat().st_size//1024}KB' for label,_ in items))
