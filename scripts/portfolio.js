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

/*
Possible future upgrade: Switch technology list to radio buttons, so user can
select/view combinations of technologies, instead of just being able to pick 1
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
  ReactDOM.render(<Portfolio projects={projects} />, document.querySelector('main'));
}

class PortfolioItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      tech: this.props.technologies
    }
    this.makeTechTags = this.makeTechTags.bind(this);
  }

  componentDidUpdate() {
    if (this.props.active !== this.state.active) {
      this.setState( { active: this.props.active });
    }
  }

  makeTechTags() {
    const techs = this.props.technologies;
    const tags = techs.map(tech => {
      return (
        <li key={this.props.name + tech}>{tech}</li>
      )
    });
    return (
      <ul>
        {tags}
      </ul>
    )
  }

  render() {
    if (!this.state.active) {
      return null;
    }
    return (
      <section key={this.props.name + 'Section'}>
        <h2>{this.props.name}</h2>
        <p>{this.props.description}</p>
        <p>Technologies used:</p>
          {this.makeTechTags()}
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
      allTech: [],
      activeTech: []
    }
    this.drawPortfolio = this.drawPortfolio.bind(this);
    this.listTechnologies = this.listTechnologies.bind(this);
    this.toggleTech = this.toggleTech.bind(this);
    this.checkActiveTech = this.checkActiveTech.bind(this);
  }

  componentDidMount() {
    const projects = this.props.projects;
    const allTech = [];
    Object.keys(projects).forEach(key => {
      projects[key].technologies.forEach(tech => {
        if (allTech.indexOf(tech) === -1) {
          allTech.push(tech);
        }
      })
    });
    allTech.sort((a,b) => a.toLowerCase() > b.toLowerCase());
    allTech.unshift('View all');
    this.setState( {
      allTech: allTech,
      activeTech: allTech
    });
  }

  listTechnologies() {
    const techToggles = this.state.allTech.map(tech => {
      return (
        <li className="sorter--list--item" id={tech + 'Toggle'} key={tech + 'Toggle'} onClick={this.toggleTech}>{tech}</li>
      );
    });

    return (
      <div className="sorter">
        Click to see only projects that use:
        <ul className="sorter--list">
          {techToggles}
        </ul>
      </div>
    );
  }

  toggleTech(event) {
    const allTech = this.state.allTech;
    const clicked = event.target.id.slice(0, -6);
    if (clicked === 'View all') {
      this.setState({ activeTech: allTech });
    }
    else {
      const newActiveTech = [ clicked ];
      this.setState({ activeTech: newActiveTech });
    }
  }

  checkActiveTech(projectTech) {
    const activeTech = this.state.activeTech;
    return projectTech.some(tech => activeTech.includes(tech) );
  }

  drawPortfolio() {
    const projects = this.props.projects;
    const result = [];
    for (let project in projects) {
      result.push(
        <PortfolioItem key={projects[project].name + "Item"} active={this.checkActiveTech(projects[project].technologies)} name={projects[project].name} description={projects[project].description} technologies={projects[project].technologies} liveUrl={projects[project].liveUrl} repoUrl={projects[project].repoUrl} imageMonitor={projects[project].imageMonitor} imagePhone={projects[project].imagePhone} />
      );
    }
    return result;
  }

  render() {
    return (
      <div className="portfolio">
        {this.listTechnologies()}
        {this.drawPortfolio()}
      </div>
    );
  }
}
