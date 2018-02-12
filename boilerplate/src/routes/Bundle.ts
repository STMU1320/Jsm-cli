import * as React from 'react';

export interface Props {
  load: Function;
  children: any;
}

class Bundle extends React.Component<Props, {}> {
  state: any = {
    // short for 'module' but that's a keyword in js, so 'mod'
    mod: null
  };

  componentWillMount () {
    this.load(this.props);
  }

  componentWillReceiveProps (nextProps: any) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load (props: Props) {
    this.setState({
      mod: null
    });
    props.load((mod: any) => {
      this.setState({
        mod: mod.default ? mod.default : mod
      });
    });
  }

  render () {
    return this.props.children(this.state.mod);
  }
}

export default Bundle;
