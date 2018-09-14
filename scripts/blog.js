/* Pulls blog.json from store. Object format:
    {
      post number, zero-indexed: {
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

class ThumbPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.styleThumb = this.styleThumb.bind(this);
  }

  componentDidUpdate() {
    if (this.props.active !== this.state.active) {
      this.setState( { active: this.props.active } );
    }
  }

  styleThumb() {
    if (this.state.active === true) {
      return {
        background: 'red'
      }
    }
    return {
      background: `url(${this.props.image})`,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };
  }

  render() {
    return(
      <div className="blog__thumbnail" style={this.styleThumb()} onClick={this.props.clickHandler} data-post={this.props.clickId}>
        <h2 data-post={this.props.clickId}>{this.props.title}</h2>
        <p data-post={this.props.clickId}>{this.props.snippet}</p>
      </div>
    );
  }
}

class FullPost extends React.Component {
  constructor(props) {
    super(props);
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
    this.drawThumbs = this.drawThumbs.bind(this);
    this.setActivePost = this.setActivePost.bind(this);
  }

  drawBlog() {
    const posts = this.props.posts;
    const keys = Object.keys(posts);
    const drawnPosts = [];
    for (let i=0; i<keys.length; i++) {
      const thisPost = posts[keys[i]];
      drawnPosts.push(<FullPost key={`post${keys[i]}`} title={thisPost.title} image={thisPost.image} imageOrientation={thisPost.imageOrientation} imageAlt={thisPost.imageAlt} snippet={thisPost.snippet} fullText={thisPost.fullText} />);
    }
    return drawnPosts;
  }

  drawThumbs() {
    // I'm using a keys array and a for loop instead of for(item in object), because
    // apparently for(i in o) returns in an unstable order across browsers, and I want
    // to be sure that blog posts are presented in reverse chronological order!
    const posts = this.props.posts;
    const keys = Object.keys(posts);
    const drawnThumbs = [];
    const activePost = this.state.activePost;
    for (let i=keys.length-1; i>=0; i--) {
      // iterating backwards to support reverse chronological ordering of posts
      const thisPost = posts[keys[i]];
      const idKey = `postThumb${i}`;
      drawnThumbs.push(<ThumbPost key={idKey} title={thisPost.title} image={thisPost.image} snippet={thisPost.snippet} clickHandler={this.setActivePost} clickId={i} active={this.state.activePost === i ? true : false} />)
    }
    return drawnThumbs;
  }

  setActivePost(event) {
    const clicked = Number(event.target.dataset.post);
    this.setState( { activePost: clicked } );
  }

  render() {
    return (
      <div className="blog__container">
        {this.drawThumbs()}
      </div>
    );
  }
}
