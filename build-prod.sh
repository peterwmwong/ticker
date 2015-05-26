#!/bin/sh

gulp production

# TODO: hackaround vulcanize not inline regular stylesheets
cat app.html | sed 's/<link rel="stylesheet" type="text\/css" href="\/build\/all.css">/<link rel="import" type="css" href="\/build\/all.css">/' > app.tmp.html

node_modules/.bin/vulcanize --inline-scripts --inline-css --abspath '/Users/peter.wong/projects/ticker' /app.tmp.html > index.unminified.html
rm app.tmp.html

# Leverage the old vulcanize to properly minify HTML
vulcanize -strip -output index.min.html index.unminified.html
rm index.unminified.html

node_modules/.bin/crisper --source index.min.html --html index.html --js index.js
rm index.min.html

node_modules/.bin/uglifyjs --compress --mangle --screw-ie8 --output index.min.js index.js
rm index.js
mv index.min.js index.js

# Remove render/layout blocks...
#   - scripts
sed -i -- 's/<script src="index.js"><\/script>/<script src="\/index.js" defer async><\/script>/' index.html
#   - fonts
sed -i -- 's/<link rel="stylesheet" href="\/\/fonts.googleapis.com\/css\?family=Roboto:400,300,300italic,400italic,500,500italic,700,700italic">//' index.html

rm index.html--
