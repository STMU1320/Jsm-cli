import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Loading } from 'components';
import { request, config, isEmpty } from 'utils';
const logoImg = require('../../assets/images/logo.png');
const titleImg = require('../../assets/images/title.svg');
const styles = require('./style.less');

class Welcome extends React.PureComponent<any, any> {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'welcome/save', payload: { description: 'A react cli' } });
    dispatch({ type: 'welcome/getWeather', payload: { key: config.AMAPKEYS } });
  }

  render() {
    const { description, weatherLive, loading } = this.props;
    const { province, city, weather, temperature } = weatherLive;
    const weatherInfo = !isEmpty(weatherLive) ? `${[province, city, weather, temperature].join(' · ')}℃` : '';
    return <>
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.bgSvg} width="100%" height="100%" version="1.1">
        <defs xmlns="http://www.w3.org/2000/svg">
          <linearGradient  id="bgLinear" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#b1d5fe', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7fa1ff', stopOpacity: 1 }} />
          </linearGradient >
        </defs>
        <rect width={window.innerWidth} height={window.innerHeight} fill="url(#bgLinear)" />
      </svg>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <img src={logoImg} width="66" height="66" alt="logo" />
        </div>
        <div className={styles.content}>
          <h1><img src={titleImg} width="80%" height="80%" alt="title" /></h1>
          <p>{description}</p>
          <p>(react - redux - typescript)</p>
          <Link className={styles.routerLink} to="detail">Detail</Link>
        </div>
      </div>
      <div className={styles.weatherInfo}>{loading ? <Loading color="white"/> : weatherInfo ? weatherInfo : 'no-data'}</div>
      </>;
  }
}

export default connect((state: any) => ({ ...state.welcome }))(Welcome);
