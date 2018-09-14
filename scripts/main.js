'use strict';

// Global navigation variables!

const navPages = [
  {name: 'Home', url:'index.html'},
  {name: 'About', url: 'about.html'},
  {name: 'Projects', url: 'projects.html'},
  {name: 'Blog', url: 'blog.html'}
];

// And now for the components

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { home: false }
    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick() {
    window.location = this.props.url;
  }

  componentDidMount() {
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
      this.setState( { home: true } );
    }
  }

  render() {
    return (
      <button
        className = {this.state.home === true ? 'nav__button nav__button--home' : 'nav__button'}
        onClick = {this.buttonClick}>
        {this.props.name}
        </button>
    )
  }

}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: navPages,
      home: true,
      navHide: true
    }
    this.buttonize = this.buttonize.bind(this);
    this.pickNav = this.pickNav.bind(this);
    this.toggleNavHide = this.toggleNavHide.bind(this);
  }

  buttonize() {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (width < 640 || (width >= 640 && this.state.home === false)) {
      return this.state.pages.map(x => (
        <li key={x.name} className="nav__list__item"><Button name={x.name} url={x.url} /></li>
      ));
    }
    else {
      return this.state.pages.map(x => (
        <li key={x.name} className="nav__list__item">
          <Button name={x.name} url={x.url} />
          <div className={`nav__list__image nav__list__image--${x.name.toLowerCase()}`} onClick={() => {window.location=x.url}} />
        </li>
      ));
    }
  }

  pickNav() {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (this.state.home === true || width >= 640) {
      return null;
    }
    return this.state.navHide ?
      (<div className="nav__toggle" onClick={this.toggleNavHide}> > </div>) :
      (<div className="nav__toggle nav__toggle--expand" onClick={this.toggleNavHide}> > </div>)
  }

  toggleNavHide() {
    const toggled = !this.state.navHide;
    this.setState({ navHide: toggled });
  }

  componentWillMount() {
    const locationString = window.location.toString();
    if (!locationString.endsWith('index.html') && !locationString.endsWith('.com/')) {
      this.setState({ home: false });
    }
    else {
      const newState = JSON.parse(JSON.stringify(this.state));
      // Switched above from newState = {...this.state} because the spread operator
      // returns a shallow copy, which I then modified below. This isn't a problem
      // in this application (state gets reset from the global navPages object with
      // each page navigation), but wanted to fix the issue to remind myself of
      // best practices.
      delete newState.pages[0];
      this.setState({...newState, home: true});
    }
  }

  render() {
    return (
      <nav className={this.state.home ? 'nav' : 'nav__header'}>
        <ul className={this.state.home ? 'nav__list' :
                       this.state.navHide ? 'nav__list--collapse' : 'nav__list--collapse nav__list--expand'}>
          {this.pickNav()}
          {this.buttonize()}
        </ul>
        <div className={this.state.home ? 'nav__outside-links' : 'nav__outside-links--header'}>
          <a href="https://github.com/ogdendavis" target="_blank">GitHub</a>
          <br />
          <a href="https://codepen.io/ogdendavis" target="_blank">CodePen</a>
        </div>
      </nav>
    )
  }
}

ReactDOM.render(<Nav />, document.querySelector('header'));
