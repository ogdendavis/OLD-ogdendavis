/*
Pulls portfolio projects from store/projects.json
Return is a JSON object with each entry in the following format:

"example-entry": {
  "name": string,
  "description": string,
  "technologies": array of strings,
  "live-url": string with full url,
  "repo-url": string with full url,
  "image-monitor": string with relative url,
  "image-phone": string with relative url
}

image-main is landscape, 763px x 600px (screenshot is ~680px wide)
image-phone is portrait,  350px x 713px (screenshot is ~300px wide)

*/
