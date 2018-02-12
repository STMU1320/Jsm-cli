import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: ${props => props.color };
  padding: 5px;
  &:before {
    content: ' ';
    margin-right: 5px;
    display: block;
    width: 2rem;
    height: 2rem;
    border: .2rem solid;
    border-left-color: transparent;
    border-radius: 50%;
    animation: ${rotate360} .8s linear infinite;
  }
`;

function Loading ({
  children = '加载中...',
  color = '#03b7ff'
}: any) {
  return <LoadingWrap color={color}>
    { children }
  </LoadingWrap>;
}

export default Loading;
