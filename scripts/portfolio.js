/*
Pulls portfolio projects from store/projects.json
Return is a JSON object with each entry in the following format:

"example-entry": {
  "name": string,
  "description": string,
  "technologies": array of strings,
  "liveUrl": string with full url,
  "repoUrl": string with full url,
  "imageMonitor": string with relative url,
  "imagePhone": string with relative url
}

imageMonitor is landscape, 763px x 600px (screenshot is ~680px wide)
imagePhone is portrait,  350px x 713px (screenshot is ~300px wide)
*/
