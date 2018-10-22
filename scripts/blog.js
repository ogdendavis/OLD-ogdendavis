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

// find width to use in all components!
function findWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}

// now for React components

class ThumbPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      active: false
    }
    this.styleThumbBackground = this.styleThumbBackground.bind(this);
    this.detailOnHover = this.detailOnHover.bind(this);
    this.noDetail = this.noDetail.bind(this);
    this.titleOrSnippet = this.titleOrSnippet.bind(this);
  }

  componentDidUpdate() {
    if (this.props.active !== this.state.active) {
      this.setState( { active: this.props.active } );
    }
  }

  styleThumbBackground() {
    return {
      background: `linear-gradient(rgba(20,20,20,0.6), rgba(20,20,20,0.8)), url(${this.props.image})`,
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };
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
        <h2 className="thumbnail__title" data-post={this.props.clickId}>{this.props.title}</h2>
      );
    } else if (this.state.hover === true) {
      return (
        <p className="thumbnail__snippet" data-post={this.props.clickId}>{this.props.snippet}</p>
      );
    }
  }

  render() {
    if (this.props.first === true) { //case for first thumb on desktop
      return(
        <div className='thumbnail'
          style={this.styleThumbBackground()}
          onClick={this.props.clickHandler}
          onMouseEnter={this.detailOnHover}
          onMouseLeave={this.noDetail}
          onTouchStart={this.detailOnHover}
          onTouchEnd={() => {window.setTimeout(this.noDetail, 3000)}}
          data-post={this.props.clickId}
        >
          <h2 className="thumbnail__title" data-post={this.props.clickId}>{this.props.title}</h2>
          <p className="thumbnail__snippet" data-post={this.props.clickId}>{this.props.snippet}</p>
          <p className="thumbnail__date">{this.props.date}</p>
        </div>
      );
    }
    //default for all others
    return(
      <div className='thumbnail'
        style={this.styleThumbBackground()}
        onClick={this.props.clickHandler}
        onMouseEnter={this.detailOnHover}
        onMouseLeave={this.noDetail}
        onTouchStart={this.detailOnHover}
        onTouchEnd={() => {window.setTimeout(this.noDetail, 3000)}}
        data-post={this.props.clickId}
      >
        {this.titleOrSnippet()}
        {findWidth() < 640 ? null : <p className="thumbnail__date">{this.props.date}</p>}
      </div>
    );
  }
}

class FullPost extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    const scrollTop = findWidth() < 640 ?
      this.scrollRef.current.offsetTop-90 :
      this.scrollRef.current.offsetTop-140;
    window.scrollTo({
      top: scrollTop,
      left: 0,
      behavior: 'smooth'
    });
  }

  render() {
    return (
      <article className="post" ref={this.scrollRef}>
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
    this.reorderKeys = this.reorderKeys.bind(this);
    this.containInactiveThumbs = this.containInactiveThumbs.bind(this);
    this.drawThumb = this.drawThumb.bind(this);
    this.drawActive = this.drawActive.bind(this);
    this.setActivePost = this.setActivePost.bind(this);
  }

  drawBlog() {
    const posts = this.props.posts;
    let keys = Object.keys(posts);
    const drawnPosts = [];

    // On desktop, move active post to the front of the line! (?)
    if (findWidth() >= 640 && this.state.activePost !== false) {
      keys = this.reorderKeys(keys);
    }

    for (let i=keys.length-1; i>=0; i--) {
      const thisKey = Number(keys[i]);
      const thisPost = posts[thisKey];
      if (findWidth() >= 640 && i === keys.length-1) { // case for first post in desktop
        drawnPosts.push(this.drawThumb(thisPost, thisKey, true, true));
        if (this.state.activePost === thisKey) {
          drawnPosts.push(this.drawActive(thisPost, thisKey));
        }
      }
      else if (this.state.activePost === thisKey) { // case for the selected post
        drawnPosts.push(this.drawThumb(thisPost, thisKey, true, false), this.drawActive(thisPost, thisKey));
      }
      else { // case for inactive posts - thumb only
        drawnPosts.push(this.drawThumb(thisPost, thisKey, false));
      }
    }

    return findWidth() < 640 ? drawnPosts :
      this.state.activePost !== false ?
      [drawnPosts[0], drawnPosts[1], this.containInactiveThumbs(drawnPosts, true)] :
      [drawnPosts[0], this.containInactiveThumbs(drawnPosts, false)];
  }

  reorderKeys(keys) {
    const activeKey = keys[this.state.activePost];
    if (activeKey && activeKey != keys.length-1) {
      const activePostFirst = keys.slice(0, Number(activeKey)).concat(keys.slice(Number(activeKey)+1, keys.length));
      activePostFirst.push(activeKey);
      return activePostFirst;
    }
    return keys;
  }

  containInactiveThumbs(allPosts, isAnyActive) {
    const inactiveThumbs = isAnyActive === true ? allPosts.slice(2) : allPosts.slice(1);
    const morePosts = isAnyActive === true ?
      <div className='thumbnail' style={{background: 'var(--orange-transparent), url(images/lucas-on-trike.jpg)', backgroundPosition: '50% 50%', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', cursor: 'default', color: '#222'}}>
        <h2 className="thumbnail__title" style={{position: 'absolute', top: '-0.5em', right: '0.5em'}}>More Posts…</h2>
      </div> : null;
    return (
      <div className="blog__thumbContainer" key="inactiveThumbs">
        {morePosts}
        {inactiveThumbs}
      </div>
    );
  }

  drawThumb(post, key, isActive, isFirst) {
    return (<ThumbPost key={`thumb${key}`} title={post.title} date={post.date} image={post.image} snippet={post.snippet} clickHandler={this.setActivePost} clickId={Number(key)} active={isActive} first={isFirst} />
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
        <img className="heading__image" src="images/lucas-in-antwerp-small.jpg" alt="Lucas drinks a beer in Belgium" />
        <h1 className="heading">My Blog</h1>
        <p className="subtitle">Thoughts on web development, technology, and life in general</p>
        {this.drawBlog()}
      </div>
    );
  }
}
