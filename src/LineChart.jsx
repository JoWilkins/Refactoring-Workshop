import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3';

const width = 1000;
const height = 750;
const LineChart = ({ data, xAxis, yAxes }) => {
  const margin = ((height + width) / 2) * 0.1;

  useEffect(() => {
    d3.selectAll('g').exit().remove();

    d3.select('#main-g-tag')
      .attr('class', 'line')
      .attr('transform', `translate(${margin}, ${margin})`);

    const ordinalDomain = data[xAxis].map((xAxisObj) => {
      return xAxisObj.qText;
    });
    const ordinalRange = ordinalDomain.map((name, index) => {
      return index * (width / ordinalDomain.length);
    });
    const xScale = d3.scaleOrdinal().domain(ordinalDomain).range(ordinalRange);

    d3.select('#xAxis')
      .attr('overflow', 'visible')
      .append('g')
      .attr('transform', `translate(${0}, ${height - margin * 2})`)
      .call(axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([0, 60000000])
      .range([height - margin * 2, 0]);

    d3.select('#yAxis')
      .attr('overflow', 'visible')
      .append('g')
      .call(axisLeft(yScale));

    const salesData = data['Sales $'].map((dataObj, index) => {
      return { qNum: dataObj.qNum, month: data['Month'][index].qText };
    });
    const budgetData = data['Budget $'].map((dataObj, index) => {
      return { qNum: dataObj.qNum, month: data['Month'][index].qText };
    });
    const lySales = data['LY Sales'].map((dataObj, index) => {
      return { qNum: dataObj.qNum, month: data['Month'][index].qText };
    });
    const valueline = d3
      .line()
      .x((data) => {
        return xScale(data.month);
      })
      .y((data) => {
        return yScale(data.qNum);
      });

    const applyLines = (data, colour) => {
      d3.select('#lines')
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colour)
        .attr('stroke-width', 3)
        .attr('d', valueline)
        .attr(
          'transform',
          `translate(${margin.right + margin.left}, ${
            0 - margin.top + margin.bottom
          })`
        );
    };
    applyLines(salesData, '#99B898');
    applyLines(budgetData, '#FECEAB');
    applyLines(lySales, '#FF847C');
    return () => {
      d3.selectAll('g').exit().remove();
    };
  }, []);

  return (
    <svg
      width={'100%'}
      height={height}
      viewBox={`${0} ${0} ${width} ${height}`}
      color="black"
    >
      <g id="main-g-tag">
        <g id="xAxis" />
        <g id="yAxis" />
        <g id="lines" />
      </g>
    </svg>
  );
};

export default LineChart;
