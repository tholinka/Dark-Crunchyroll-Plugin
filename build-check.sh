#!/bin/sh

# see if ./build/* are there
for file in background_script.js content_script.js manifest.json styles.css background_page.html; do
    if [ ! -f ./build/$file ]; then
        echo "missing $file"
        exit 1
    fi
done

echo "All files present"
exit 0
