const fs=require('fs');const h=fs.readFileSync('thiep-moi-dam-cuoi.html','utf8');console.log(h.replace(/data:[^;]+;base64,[A-Za-z0-9+/=]+/g,'EMBEDDED_ASSET'));
