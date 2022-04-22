import { useEffect, useState } from 'react';
import { ChartsContainer, Row, Column } from './LayoutComponents';
import TableComponent from './TableComponent';
import * as d3 from 'd3';
import styled from 'styled-components';

const headers = [
  {
    title: 'Sales Rep',
    keyValue: 'salesRep',
    sourceDataIndexes: [0],
    displayType: 'text',
    width: 100,
  },
  {
    title: 'Budget vs Sales',
    keyValue: 'BudgetVsSales',
    sourceDataIndexes: [1, 2],
    displayType: 'barchart',
    width: 400,
  },
  {
    title: 'Margin %',
    keyValue: 'marginPercent',
    sourceDataIndexes: [3],
    displayType: 'percent',
    width: 50,
  },
];

const formatPercent = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

const CenteringDiv = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

const MiniBarChart = ({ barData, id }) => {
  // console.log('barData', barData);
  useEffect(() => {
    d3.selectAll('g').exit().remove();
    const height = 100;
    const width = 300;
    const svg = d3
      .select(`#${id}`)
      .attr('height', height)
      .attr('width', width)
      .attr('viewBox', `${width} ${0} ${width} ${height}`)
      .attr('color', 'black');

    const yScale = d3
      .scaleBand()
      .domain(barData.map((data) => data.name))
      .range([0, height])
      .padding(0.2);

    svg
      .append('g')
      .attr('transform', `translate(${width}, ${0})`)
      .call(d3.axisLeft(yScale));

    const xScale = d3
      .scaleLinear()
      .range([width, 0])
      .domain([0, d3.max(barData.map((data) => data.value))]);

    const colorScale = d3
      .scaleOrdinal(d3.schemeTableau10)
      .domain(barData.map((data) => data.name));

    svg
      .selectAll('rect')
      .data(barData)
      .enter()
      .append('rect')
      .attr('x', function (data) {
        return xScale(0);
      })
      .attr('y', function (data) {
        return yScale(data.name);
      })
      .attr('height', yScale.bandwidth())
      .attr('width', function (data) {
        return width - xScale(data.value);
      })
      .style('fill', (data) => colorScale(data.value));

    svg.selectAll('text').attr('font-size', '14px');
  }, [barData]);

  return (
    <CenteringDiv>
      <svg id={id} />
    </CenteringDiv>
  );
};

const Table = ({ qlikApp, objectId }) => {
  const [data, setData] = useState();
  const [tableData, setTableData] = useState();

  const generateTableData = () => {
    const newTableData = [];
    data.forEach((tableRow, rowIndex) => {
      const rowObject = {};
      headers.forEach((headerObj) => {
        const { keyValue, displayType, sourceDataIndexes } = headerObj;

        if (displayType === 'text') {
          rowObject[keyValue] = tableRow[sourceDataIndexes[0]].qText;
        } else if (displayType === 'percent') {
          rowObject[keyValue] = formatPercent(
            tableRow[sourceDataIndexes[0]].qNum
          );
        } else if (displayType === 'barchart') {
          const barData = [
            { name: 'budget', value: tableRow[sourceDataIndexes[0]].qNum },
            { name: 'sales', value: tableRow[sourceDataIndexes[1]].qNum },
          ];
          rowObject[keyValue] = (
            <MiniBarChart barData={barData} id={`${keyValue}-${rowIndex}`} />
          );
        } else {
          rowObject[keyValue] = '';
        }
      });
      newTableData.push(rowObject);
    });
    return newTableData;
  };

  useEffect(() => {
    if (data) {
      const tableData = generateTableData();
      setTableData(tableData);
    }
  }, [data]);

  useEffect(() => {
    let qlikObject;
    const getData = async () => {
      const layout = await qlikObject.getLayout();
      const hyperCube = await qlikObject.getHyperCubeData({
        qPath: '/qHyperCubeDef',
        qPages: [
          {
            qLeft: 0,
            qTop: 0,
            qWidth: layout.qHyperCube.qSize.qcx,
            qHeight: layout.qHyperCube.qSize.qcy,
          },
        ],
      });
      const qMatrix = hyperCube[0].qMatrix;
      setData(qMatrix);
    };
    const getQlikObject = async () => {
      qlikObject = await qlikApp.getObject(objectId);
      getData();
      qlikObject.on('changed', getData);
    };
    if (qlikApp && objectId) {
      getQlikObject();
    }
    return () => {
      if (qlikObject) {
        qlikObject.removeListener('changed', getData);
      }
    };
  }, [qlikApp, objectId]);

  return (
    <ChartsContainer>
      <Row width={100} size={1}>
        <Column width={1}>
          {tableData && <TableComponent headers={headers} data={tableData} />}
        </Column>
      </Row>
    </ChartsContainer>
  );
};

export default Table;
