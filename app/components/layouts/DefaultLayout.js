import React from 'react';
import Relay from 'react-relay';
import Page from '../pages/page.js';
import PostContent from '../posts/PostContent';

import CSSModules from 'react-css-modules';
import styles from '../pages/page.scss';

@CSSModules(styles, {allowMultiple: true})
class DefaultLayout extends React.Component{

  componentWillMount(){
    this.props.relay.setVariables({
      page: this.props.page,
      condition: this.props.condition
    })
  }

  render(){
    const { viewer } = this.props;
    console.log(viewer);

    if (viewer.post){
      const { post_title, post_content, thumbnail } = viewer.post;

      let bg = {
        backgroundImage: "url('" + thumbnail + "')"
      }

      let heroClass = thumbnail ? "hero_thumbnail" : "hero";
      return(
      	<div>
          <div styleName={heroClass} style={bg}>
  					<div styleName="wrapper tight">
              <h2 styleName="title">{post_title}</h2>
  					</div>
  				</div>

  				<div styleName="content">
  					<div styleName="wrapper tight">
              <h1>Test</h1>
  						<PostContent content={post_content}/>
  					</div>
  				</div>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
  }
}

export default Relay.createContainer(DefaultLayout, {

  initialVariables:{
    page: null,
    condition: null
  },

  prepareVariables(prevVars){
    console.log('prevVars:', prevVars);
    return{
      ...prevVars
    }
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        post(post_name:$page){
          id
          post_title
          post_content
          thumbnail
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
