const h=require('fs').readFileSync('reference-wedding.html','utf8');console.log(h.match(/#HEADLINE59 > \.ladi-headline\{[^}]+/)[0]);console.log(h.match(/#HEADLINE114 > \.ladi-headline\{[^}]+/)?.[0]);
