import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: ${({ colour }) => colour || 'black'};
`;

const Row = styled.div` 
  display: flex;
  flex-direction: row;
  width: ${({ totalWidth }) => totalWidth || '100%'};
  max-height: 100px;
  height: 100%;
  min-height: 50px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'white'};
  color: ${({ colour }) => colour || 'black'};
  border-bottom: solid 1px;
  div:last-child {
    border-right: none;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  width: ${({ width }) => width || '100%'};
  padding: 15px;
  border-right: solid 1px;
`;

const TableComponent = ({ headers, data, headersColour }) => {
  const totalWidth = headers.reduce((runningTotal, headerObj) => {
    let currTotal = runningTotal + headerObj.width;
    return currTotal;
  }, 0);
  return (
    <TableWrapper>
      {/* Headers Row */}
      <Row
        totalWidth={`${totalWidth}px`}
        colour={headersColour}
        backgroundColor="darkGrey"
      >
        {headers.map((header) => {
          return (
            <Cell key={header.keyValue} width={`${header.width}px`}>
              {header.title}
            </Cell>
          );
        })}
      </Row>
      {/* All Data rows */}
      {data.map((row, rowIndex) => {
        return (
          <Row totalWidth={`${totalWidth}px`} key={`row-${rowIndex}`}>
            {headers.map((headerObject, cellIndex) => {
              const { keyValue, width } = headerObject;
              const value = row[keyValue];
              return (
                <Cell key={`${value}-${cellIndex}`} width={`${width}px`}>
                  {value}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </TableWrapper>
  );
};

export default TableComponent;
