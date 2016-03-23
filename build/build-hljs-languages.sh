#!/bin/sh

dest="vendor/highlightjs/languages/"
node_modules/.bin/uglifyjs --compress --mangle -- node_modules/highlight.js/lib/highlight.js > vendor/highlightjs/highlight.min.js

for i in $(ls node_modules/highlight.js/lib/languages); do
  a="${i%%.*}";
  echo "(function(){var l=function(hljs) {" > "$dest$i"
  tail -n +2 "node_modules/highlight.js/lib/languages/$i"  >> "$dest$i"
  echo "hljs.registerLanguage('$a', l);})();" >> "$dest$i"
  node_modules/.bin/uglifyjs --compress --mangle -- "$dest$i" > "$dest$a.min.js"
  rm "$dest$i"
done
