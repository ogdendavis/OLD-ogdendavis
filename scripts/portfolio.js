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

const requestUrl = './store/projects.json';
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
      tech: this.props.technologies,
      detailsVisible: false
    }
    this.makeTechTags = this.makeTechTags.bind(this);
    this.makeDetails = this.makeDetails.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);
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
        <li key={this.props.name + tech} className="portfolio__tech-list__item">{tech}</li>
      )
    });
    return (
      <ul className="portfolio__tech-list">
        <li className="portfolio__tech-list__heading">Technologies used:</li>
        {tags}
      </ul>
    )
  }

  makeDetails() {
    if (!this.state.detailsVisible) {
      return null;
    }
    return (
      <div className="portfolio__details">
        <ul className="portfolio__links">
          <li><a href={this.props.liveUrl} target="_blank">See live demo</a></li>
          <li><a href={this.props.repoUrl} target="_blank">See code repo</a></li>
        </ul>
        {this.makeTechTags()}
      </div>);
  }

  showDetails(event) {
    this.setState({ detailsVisible: true });
  }

  hideDetails(event) {
    this.setState({ detailsVisible: false });
  }

  render() {
    if (!this.state.active) {
      return null;
    }
    return (
      <section className="portfolio__item" key={this.props.name + 'Section'}>
        <h2 className="heading--emphasis">{this.props.name}</h2>
        <p className="portfolio__item-description">{this.props.description}</p>
        <div className="portfolio__images"
          onMouseEnter={this.showDetails}
          onMouseLeave= {this.hideDetails}
          onTouchStart={this.showDetails}
          onTouchEnd={() => {window.setTimeout(this.hideDetails, 3000)}}
        >
          {this.makeDetails()}
          <a href={this.props.liveUrl} target="_blank">
            <img src={this.props.imageMonitor} className="portfolio__image portfolio__image--landscape"/>
            <img src={this.props.imagePhone} className="portfolio__image portfolio__image--portrait"/>
          </a>
        </div>
      </section>
    );
  }
}

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTech: [],
      activeTech: [],
      sorterVisible: false
    }
    this.drawSorter = this.drawSorter.bind(this);
    this.drawProjects = this.drawProjects.bind(this);
    this.toggleTech = this.toggleTech.bind(this);
    this.checkActiveTech = this.checkActiveTech.bind(this);
    this.showTechToggles = this.showTechToggles.bind(this);
    this.hideTechToggles = this.hideTechToggles.bind(this);
    this.handleSorterButtonClick = this.handleSorterButtonClick.bind(this);
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

  drawSorter(sorterVisible) {
    const techToggles = this.state.allTech.map(tech => {
      return (
        <li className="sorter__list__item" id={tech + 'Toggle'} key={tech + 'Toggle'} onClick={this.toggleTech}>{tech}</li>
      );
    });

    const sorter = !sorterVisible ? null :
    <ul className="sorter__list">
      {techToggles}
    </ul>;

    return (
      <div className="sorter">
        <button className="sorter__button" onClick={this.handleSorterButtonClick}>Filter projects by technology</button>
        {sorter}
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

  handleSorterButtonClick(event) {
    if (this.state.sorterVisible === false) {
      this.showTechToggles(event);
    } else if (this.state.sorterVisible === true){
      this.hideTechToggles(event);
    }
  }

  showTechToggles(event) {
    this.setState({ sorterVisible: true });
    document.querySelector('.sorter--button').innerText = 'Hide list';
    window.setTimeout(() => {window.addEventListener('click', this.hideTechToggles, {once: true})}, 100);
  }

  hideTechToggles(event) {
    this.setState({ sorterVisible: false });
    document.querySelector('.sorter--button').innerText = 'Filter projects by technology';
  }

  checkActiveTech(projectTech) {
    const activeTech = this.state.activeTech;
    return projectTech.some(tech => activeTech.includes(tech) );
  }

  drawProjects() {
    const projects = this.props.projects;
    const result = [];
    for (let project in projects) {
      result.push(
        <PortfolioItem key={projects[project].name + "Item"} active={this.checkActiveTech(projects[project].technologies)} name={projects[project].name} description={projects[project].description} technologies={projects[project].technologies} liveUrl={projects[project].liveUrl} repoUrl={projects[project].repoUrl} imageMonitor={projects[project].imageMonitor} imagePhone={projects[project].imagePhone} />
      );
    }
    return (
      <div className="portfolio">
        {result}
      </div>
      );
  }

  render() {
    return (
      <div className="portfolio__container">
        <img className="heading__image" src="images/lucas-on-trike-small.jpg" alt="Lucas on a small tricycle" />
        <h1 className="heading">My Portfolio</h1>
        {this.drawSorter(this.state.sorterVisible)}
        {this.drawProjects()}
      </div>
    );
  }
}
