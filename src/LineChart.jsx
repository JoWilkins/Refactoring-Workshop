import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3';

const LineChart = ({ data, xAxis, yAxes }) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 1000;
  // - margin.left - margin.right;
  const height = 750;
  // - margin.top - margin.bottom;

  useEffect(() => {
    d3.selectAll('g').exit().remove();
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
      .attr(
        'transform',
        `translate(${margin.right + margin.left}, ${
          height / 2 + (margin.bottom - margin.top)
        })`
      )
      .call(axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain([0, 60000000])
      .range([height / 2, 0]);

    d3.select('#yAxis')
      .attr('overflow', 'visible')
      .append('g')
      .attr(
        'transform',
        `translate(${margin.right + margin.left}, ${
          0 - margin.top + margin.bottom
        })`
      )
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
        .attr('strokeWidth', 3)
        .attr('d', valueline)
        .attr(
          'transform',
          `translate(${margin.right + margin.left}, ${
            0 - margin.top + margin.bottom
          })`
        );
    };
    applyLines(salesData, 'red');
    applyLines(budgetData, 'green');
    applyLines(lySales, 'blue');
    return () => {
      d3.selectAll('g').exit().remove();
    };
  }, []);

  return (
    <svg width={width} height={height} viewBox="0 0 1000 750">
      <g id="xAxis" />
      <g id="yAxis" />
      <g id="lines" />
    </svg>
  );
};

export default LineChart;
