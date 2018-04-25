
import * as React from 'react';
import { connect } from 'react-redux';
const styles = require('./style.less');

class <% name %> extends React.PureComponent<any, any> {
  componentDidMount () {
    // do something
  }

  render() {
    return (
      <div className={styles.content}>
        <h1><% title %></h1>
        <p><% content %></p>
      </div>
    );
  }
}

export default connect(({ <% namespace %> }: any) => ({ ...<% namespace %> }))(<% name %>);
