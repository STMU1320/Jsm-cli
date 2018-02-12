import * as React from 'react';
import { connect } from 'react-redux';
import { history } from 'utils';
const styles = require('./style.less');

const IntroItem =  ({ main = '', detail = '' }: any) => <p className={styles.intro}><span>{main}:</span>{detail}</p>;

class Detail extends React.PureComponent<any, any> {
  componentDidMount () {
    // do something
  }

  handleBack = () => {
    history.goBack();
  }

  render() {
    return (
      <div className={styles.content}>
        <h1>Technology Stack</h1>
        <IntroItem main="Framework" detail="React@16.2.0"/>
        <IntroItem main="Development language" detail="Typescript | Javascript"/>
        <IntroItem main="Route" detail="React-Router@4.2.0"/>
        <IntroItem main="Store" detail="Redux & Redux-Saga"/>
        <IntroItem main="CSS" detail="Styled-components | Less | Scss"/>
        <p><button onClick={this.handleBack}>Back</button></p>
      </div>
    );
  }
}

export default connect((state: any) => ({ ...state.detail }))(Detail);
