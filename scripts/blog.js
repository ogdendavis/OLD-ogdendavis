/* Pulls blog.json from store. Object format:
    {
      post number, starting from 001: {
        "title": string,
        "image": string with relative URL for featured image,
        "imageOrientation": either "portrait" or "landscape",
        "imageAlt": alternate text for image,
        "snippet": a 1-2 sentence summary for preview, with no markup,
        "fullText": the full blog post, with html markup included in the string
      }
    }
*/

'use strict';

// AJAX call Modified from portfolio.js
const requestUrl = './store/blog.json';
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
  loadBlog(blogObject);
}

function loadBlog(blog) {
  ReactDOM.render(<Blog posts={blog} />, document.querySelector('.main'));
}

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.renderImage = this.renderImage.bind(this);
  }

  renderImage() {
    return (
      <figure>
        <img src={this.props.image} alt={this.props.imageAlt} width={this.props.imageOrientation === 'landscape' ? '60%' : '30%'} />
      </figure>
    );
  }

  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
        <div>{this.props.snippet}</div>
        {this.renderImage()}
        <div dangerouslySetInnerHTML={ { __html: this.props.fullText } } />
      </article>
    );
  }
}

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePost: false // The number of the post being fully displayed will go here!
    }
    this.drawBlog = this.drawBlog.bind(this);
  }

  drawBlog() {
    const posts = this.props.posts;
    const keys = Object.keys(posts);
    const drawnPosts = [];
    for (let i=0; i<keys.length; i++) {
      const thisPost = posts[keys[i]];
      drawnPosts.push(<Post key={`post${keys[i]}`} title={thisPost.title} image={thisPost.image} imageOrientation={thisPost.imageOrientation} imageAlt={thisPost.imageAlt} snippet={thisPost.snippet} fullText={thisPost.fullText} />);
    }
    return drawnPosts;
  }

  render() {
    return (
      <div className="blog__container">
        {this.drawBlog()}
      </div>
    );
  }
}
