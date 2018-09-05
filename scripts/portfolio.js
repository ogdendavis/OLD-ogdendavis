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

'use strict';

/* This uses a link to the projects.json file in the DEVELOPMENT branch on GitHub. When ready for release,
switch it to finding the JSON object from ogdendavis.com */
const requestUrl = 'https://raw.githubusercontent.com/ogdendavis/ogdendavis/development/store/projects.json';
const getJSON = new XMLHttpRequest();
getJSON.open('GET', requestUrl, true);
getJSON.responseType = 'json';
getJSON.send();
getJSON.onload = function() {
  const rawJSON = getJSON.response;
  const keys = Object.keys(rawJSON);
  const projectsObject = {};
  for (let keyIndex in keys) {
    let project = keys[keyIndex];
    projectsObject[project] = JSON.parse(JSON.stringify(rawJSON[project]));
  }
  loadPortfolio(projectsObject);
}

function loadPortfolio(projects) {
  ReactDOM.render(<Portfolio projects={projects} />, document.querySelector('main'))
}

class PortfolioItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }

  render() {
    return (
      <section key={this.props.name + 'Section'}>
        <h1>{this.props.name}</h1>
        <p>{this.props.description}</p>
        <p>Technologies used: {this.props.technologies}</p>
        <ul>
          <li><a href={this.props.liveUrl}>See live demo</a></li>
          <li><a href={this.props.repoUrl}>See code repo</a></li>
        </ul>
        <img src={this.props.imageMonitor} />
        <img src={this.props.imagePhone} />
      </section>
    );
  }
}

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      technologies: 'all'
    }
    this.drawPortfolio = this.drawPortfolio.bind(this);
  }

  drawPortfolio() {
    const projects = this.props.projects;
    const result = [];
    for (let project in projects) {
      result.push(
        <PortfolioItem key={projects[project].name + "Item"} name={projects[project].name} description={projects[project].description} technologies={projects[project].technologies} liveUrl={projects[project].liveUrl} repoUrl={projects[project].repoUrl} imageMonitor={projects[project].imageMonitor} imagePhone={projects[project].imagePhone} />
      );
    }
    return result;
  }

  render() {
    return (
      <div className="container">
        {this.drawPortfolio()}
      </div>
    );
  }
}
