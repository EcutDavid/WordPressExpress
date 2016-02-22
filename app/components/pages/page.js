import React from 'react';
import Relay from 'react-relay';

import PageAnimations from './PageAnimations.js';
import { AnimateItem } from '../../animations.js'

import Layouts from '../layouts/layouts.js';
import DefaultLayout from '../layouts/DefaultLayout.js';
import PostList from '../posts/PostList.js';

import CSSModules from 'react-css-modules';
import styles from './page.scss';

@CSSModules(styles, {allowMultiple:true})
class Page extends React.Component{

  _setLayout(){
    console.log(this.props);
    const Layout = this.props.viewer.page.layout.meta_value || 'DefaultLayout';
    const isDefault = Layout === 'DefaultLayout';
    const isPostList = Layout === 'PostList';

    this.props.relay.setVariables({
      page: this.props.page,
      isDefault: isDefault,
      isPostList: isPostList
    })
  }

  componentWillMount(){
    this._setLayout()
  }

	componentDidMount(){
		let animation = this.props.animation || PageAnimations.animateIn;
		AnimateItem(this._page, PageAnimations.animateIn);
	}

	render(){
		const { viewer, className, children, withWrapper } = this.props;
    const { page } = viewer;
    const Layout = Layouts[page.layout.meta_value];

    if (Layout){
      return(
  			<div ref={ (c) => this._page = c } className={styles.base + ' ' + className}>
          <Layout.Component viewer={viewer} page={page} layout={Layout}/>
  			</div>
  		)
    } else {
      return(
        <div>Loading...</div>
      )
    }
	}
}

const COMPONENTS = [
  [DefaultLayout, 'isDefault'],
  [PostList, 'isPostList']
];

export default Relay.createContainer(Page, {

  initialVariables: {
    page: null,
    isDefault: true,
    isPostList: false
  },

  prepareVariables(prevVars){
    return{
      ...prevVars
    }
  },

  fragments: {
    viewer: (variables) => Relay.QL`
    fragment on User {
      ${COMPONENTS.map( ([Component, layout]) => {
        const condition = variables[layout];
        return Component
          .getFragment('viewer', {page: variables.page})
          .if(condition)
      })},
      page(post_name:$page) {
        id
        layout{
          id
          meta_value
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
