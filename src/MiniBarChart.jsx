import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

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

export default MiniBarChart;
