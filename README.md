# Dark Crunchyroll Plugin
This is the Micrsoft Edge branch of the Dark Crunchyroll Plugin, used to build the Micrsoft Edge version of the plugin.

Edge specific links:
* [How to convert extension to edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging)
* [How to publish to the microsoft store](https://docs.microsoft.com/en-us/microsoft-edge/extensions/getting-started#publishing-to-the-microsoft-store)
* [How to use manifestjs to package extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions)

&nbsp;

Howto:
1) open up powershell, cd to directory above the git folder.
1) run ```manifoldjs -l debug -p edgeextension -f edgeextension -m Dark-Crunchyroll-Plugin\manifest.json```
1) edit ```DarkCR\edgeextension\manifest\appxmanifest.xml```
    * Go to [the app dashboard](https://developer.microsoft.com/en-us/dashboard/), click on the app -> app management -> app identity
    * Copy the values from that page into ```Name```, ```Publisher```, and ```PublisherDisplayName``` fields
    * Edit the ```Version``` field to have a 0 for the last number (e.g. ```1.3.1.0``` instead of ```0.1.3.1```)
1) then run ```manifoldjs -l debug -p edgeextension package DarkCR\edgeextension\manifest\```
1) back on the dashboard, create a new submission and fill it out