import React, { Component, ComponentType, LazyExoticComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
export class Manager extends Component {
  private component: LazyExoticComponent<ComponentType>;

  @observable private componentLoaded: boolean;

  componentDidMount () {
    // import('./ContentManager.async').then(Component => {
    //   console.log('---');
    //
    //   this.component = Component;
    //   this.componentLoaded = true;
    // });

    // this.component = React.lazy(() => import('./ContentManager.async'));
  }

  render () {
    return (
      <this.component />
    );
  }
}
