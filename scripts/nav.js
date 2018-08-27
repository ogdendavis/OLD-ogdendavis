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
      this.setState({
        active: true
      });
    }
  }

  render() {
    return (
      <button
        className = {this.state.active ? 'button button-active' : 'button'}
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
      pages: navPages
    }
  }

  render() {
    return (
      <div className="nav--container">
        <nav className="nav"><ul>
          {this.state.pages.map(x => (
            <li key={x.name}><Button name={x.name} url={x.url} /></li>
          ))}
        </ul></nav>
        <div className="nav nav--outside">
          <a href="https://github.com/ogdendavis" target="_blank">GitHub</a>
          <a href="https://codepen.io/ogdendavis" target="_blank">CodePen</a>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Nav />, document.querySelector('header'));
