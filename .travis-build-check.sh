#!/bin/sh

# see if ./build/* are there
for file in background_page.html background_script.js content_script.js dark-crunchyroll-chrome.zip dark-crunchyroll-firefox.zip manifest.json styles.css; do
	if [ ! -f ./build/$file ]; then
		echo "missing $file"
		exit 1
	fi
done

# see if ./build/images/* are there
for file in arrows.png dark_crunchyroll_128.png white_crunchyroll_128.png queue_arrow.png queue_dropdown_arrow.png quote_end.png quote_start.png views-count-bubble.png; do
	if [ ! -f ./build/images/$file ]; then
		echo "missing $file"
		exit 1
	fi
done

echo "All files present"
exit 0
