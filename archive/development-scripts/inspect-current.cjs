const fs=require('fs');const h=fs.readFileSync('thiep-moi-dam-cuoi.html','utf8');
console.log('BODY',h.slice(h.indexOf('<body>'),h.indexOf('<div class="doors"')).slice(0,23000));
console.log('SCRIPT',h.match(/<script>([\s\S]*?)<\/script>/)[1]);
console.log('LAST STYLE',h.slice(h.lastIndexOf('html,body{background:#fff}'),h.indexOf('</style>')).replace(/data:font[^)]+/g,'FONT').slice(0,21000));
