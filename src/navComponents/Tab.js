import React from 'react';
import styled from 'styled-components';


const StyledTab = styled.div`
  padding: 1em 2em;
  font-size: 1.5em;

  :hover {
    background-color: lightGrey;
  }

  &.selected {
    background-color: grey;

  }
`

const Tab = (props) => {
  return (
    <StyledTab onClick={() => props.setSelectedTab(props.label)} className={props.label === props.selectedTab ? 'selected' : ''}>
      {props.label}
    </StyledTab>
  );
}

export default Tab;
