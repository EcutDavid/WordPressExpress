import React from 'react';
import Relay from 'react-relay';

import Page from '../pages/page.js';
import PostExcerpt from './PostExcerpt.js';
import Button from '../button/button.js';

class PostList extends React.Component{

  constructor(){
    super();
    this._loadMorePosts = this._loadMorePosts.bind(this);
  }

  componentWillMount(){
    const { limit, postType } = this.props.layout;
    console.log('mounting props:', this.props);

    this.props.relay.setVariables({
      page: this.props.page,
      limit: limit,
      postType: postType,
      condition: true
    })

  }

  render(){
    // console.log('post list viewer:',this.props.viewer);
    const { viewer } = this.props;
    const { posts } = viewer;

    const { hasNextPage, hasPreviousPage } = posts.pageInfo;

    return posts == null ? <div></div> :
      <div>

        {posts.edges.map( (post, index) => {
          return(
            <PostExcerpt index={index} key={post.node.id} viewer={this.props.viewer} {...post.node} />
          )
        })}

        { hasNextPage &&
          <Button type="primary center" onClick={this._loadMorePosts}>Load More</Button>
        }
      </div>
  }

  _loadMorePosts(){
    const { limit, postType } = this.props.relay.variables;

    this.props.relay.setVariables({
      limit: limit * 2,
      postType: postType
    })
  }
}

export default Relay.createContainer(PostList, {

  initialVariables: {
    limit: 10,
    postType: 'post',
    condition: true
  },

  prepareVariables(prevVars){
    console.log('prev vars:', prevVars);
    return{
      ...prevVars
    }
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        posts(post_type: $postType first: $limit){
					edges{
            cursor
						node{
							id
							post_title
							post_name
							post_excerpt
              thumbnail
						}
					},
          pageInfo{
            hasNextPage,
            hasPreviousPage
          }
				},
        settings{
          id
          uploads
          amazonS3
        }
			}
    `
  }
});
