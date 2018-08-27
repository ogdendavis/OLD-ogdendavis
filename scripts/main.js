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
    this.state = {
      active: false
    };
    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick() {
    window.location = this.props.url;
  }

  componentWillMount() {
    if (window.location.toString().endsWith(this.props.url) && !this.state.active) {
      this.setState({ active: true });
    }
  }

  render() {
    return (
      <button
        className = {this.state.active ? 'nav--button nav--button--active' : 'nav--button'}
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
      home: true
    }
  }

  componentWillMount() {
    if (!window.location.toString().endsWith('index.html')) {
      this.setState({...this.state, home: false});
    }
    else if (this.state.home === false && window.location.toString().endsWith('index.html')) {
      this.setState({...this.state, home: true});
    }
  }

  render() {
    return (
      <nav className={this.state.home ? 'nav' : 'nav nav__top'}>
        <ul className="nav--list">
          {this.state.pages.map(x => (
            <li key={x.name} className="nav--list--item"><Button name={x.name} url={x.url} /></li>
          ))}
        </ul>
        <div className="nav--outside-links">
          <a href="https://github.com/ogdendavis" target="_blank">GitHub</a>
          <br />
          <a href="https://codepen.io/ogdendavis" target="_blank">CodePen</a>
        </div>
      </nav>
    )
  }
}

ReactDOM.render(<Nav />, document.querySelector('header'));
