import styled from 'styled-components';

export const ChartsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: scroll;
`;

export const Row = styled.div`
  width: ${(props) => props.width}%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  flex-grow: ${(props) => props.size};
  flex-shrink: ${(props) => props.size};
  flex-basis: 10px;
`;

export const Column = styled.div`
  flex-grow: ${(props) => props.width};
  flex-shrink: ${(props) => props.width};
  flex-basis: ${(props) => props.width * 100}px;
  margin: 1em;
  display: flex;
  align-items: center;
  justify-content: center;

  @media all and (max-width: 850px) {
    flex: 1 100%;
  }
`;
