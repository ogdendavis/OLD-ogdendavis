/* Pulls blog.json from store. Object format:
    {
      post number, starting from 001: {
        "title": string,
        "image": string with relative URL for featured image,
        "imageOrientation": either "portrait" or "landscape",
        "snippet": a 1-2 sentence summary for preview, with no markup,
        "fullText": the full blog post, marked with <p></p> tags
      }
    }
*/

'use strict';

// AJAX call Modified from portfolio.js
// Currently using blog.json from GitHub development branch.
// Switch to relative URL call when going live
const requestUrl = 'https://raw.githubusercontent.com/ogdendavis/ogdendavis/development/store/blog.json';
const getJSON = new XMLHttpRequest();
getJSON.open('GET', requestUrl, true);
getJSON.responseType = 'json';
getJSON.send();
getJSON.onload = function() {
  const rawJSON = getJSON.response;
  const keys = Object.keys(rawJSON);
  const blogObject = {};
  for (let keyIndex in keys) {
    let post = keys[keyIndex];
    blogObject[post] = JSON.parse(JSON.stringify(rawJSON[post]));
  }
  loadPortfolio(blogObject);
}

function loadBlog(blog) {
  document.querySelector('.main').innerHTML = JSON.stringify(blogObject);
}
