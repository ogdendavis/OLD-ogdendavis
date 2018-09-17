/* Pulls blog.json from store. Object format:
    {
      post number, zero-indexed: {
        "title": string,
        "date": string,
        "image": string with relative URL for featured image,
        "imageOrientation": either "portrait" or "landscape",
        "imageAlt": alternate text for image,
        "snippet": a 1-line summary for preview, with no markup,
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
      hover: false
    }
    this.styleThumb = this.styleThumb.bind(this);
    this.detailOnHover = this.detailOnHover.bind(this);
    this.noDetail = this.noDetail.bind(this);
    this.titleOrSnippet = this.titleOrSnippet.bind(this);
  }

  styleThumb() {
    const backgroundStyles = {
      background: `linear-gradient(rgba(20,20,20,0.7), rgba(20,20,20,0.9)), url(${this.props.image})`,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };
    const hoverStyles = {
      boxShadow: '0 0 1.5em var(--text-color)',
    };
    if (this.state.hover === true) {
      return {
        ...backgroundStyles,
        ...hoverStyles
      };
    } else {
      return backgroundStyles;
    }
  }

  detailOnHover() {
    this.setState( { hover: true });
  }

  noDetail() {
    this.setState( { hover: false });
  }

  titleOrSnippet() {
    if (this.state.hover === false) {
      return (
        <div>
          <h2 className="thumbnail__title" data-post={this.props.clickId}>{this.props.title}</h2>
          <p className="thumbnail__date">{this.props.date}</p>
        </div>
      );
    } else if (this.state.hover === true) {
      return (
        <p className="thumbnail__snippet" data-post={this.props.clickId}>{this.props.snippet}</p>
      );
    }
  }

  render() {
    return(
      <div className="thumbnail"
        style={this.styleThumb()}
        onClick={this.props.clickHandler}
        onMouseEnter={this.detailOnHover}
        onMouseLeave={this.noDetail}
        onTouchStart={this.detailOnHover}
        onTouchEnd={() => {window.setTimeout(this.noDetail, 3000)}}
        data-post={this.props.clickId}
      >
        {this.titleOrSnippet()}
      </div>
    );
  }
}

class FullPost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="post">
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
    this.drawThumb = this.drawThumb.bind(this);
    this.drawActive = this.drawActive.bind(this);
    this.setActivePost = this.setActivePost.bind(this);
  }

  drawBlog() {
    const posts = this.props.posts;
    const keys = Object.keys(posts);
    const drawnPosts = [];
    for (let i=keys.length-1; i>=0; i--) {
      const thisKey = keys[i];
      const thisPost = posts[thisKey];
      if (this.state.activePost === i) { // case for the selected post
        drawnPosts.push(this.drawThumb(thisPost, thisKey, i), this.drawActive(thisPost, thisKey));
      }
      else { // case for inactive posts - thumb only
        drawnPosts.push(this.drawThumb(thisPost, thisKey, i));
      }
    }
    return drawnPosts;
  }

  drawThumb(post, key, index) {
    return (<ThumbPost key={`thumb${key}`} title={post.title} date={post.date} image={post.image} snippet={post.snippet} clickHandler={this.setActivePost} clickId={index} />
    );
  }

  drawActive(post, key) {
    return (<FullPost key={`post${key}`} title={post.title} image={post.image} imageOrientation={post.imageOrientation} imageAlt={post.imageAlt} snippet={post.snippet} fullText={post.fullText} />);
  }

  setActivePost(event) {
    const clicked = Number(event.target.dataset.post);
    if (this.state.activePost === clicked) {
      this.setState( { activePost: false } );
    }
    else {
      this.setState( { activePost: clicked } );
    }
  }

  render() {
    return (
      <div className="blog__container">
        <img className="heading__image" src="images/lucas-in-antwerp-small.jpg" alt="Lucas on a small tricycle" />
        <h1 className="heading">My Blog</h1>
        <p className="subtitle">Thoughts on web development, technology, and life in general</p>
        {this.drawBlog()}
      </div>
    );
  }
}
