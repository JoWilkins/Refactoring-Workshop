import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LineChart from './LineChart';

const ChartWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MultiLineChart = ({ qlikApp, objectId }) => {
  const [data, setData] = useState();
  const [xAxis, setxAxis] = useState();
  const [yAxes, setyAxes] = useState();

  useEffect(() => {
    let qlikObject;
    const getData = async () => {
      const layout = await qlikObject.getLayout();
      const columnTitles = [
        ...layout.qHyperCube.qDimensionInfo,
        ...layout.qHyperCube.qMeasureInfo,
      ];
      const hyperCubeData = await qlikObject.getHyperCubeData({
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
      const formattedData = {};

      hyperCubeData[0].qMatrix.forEach((row) => {
        // columnTitles.forEach((columnTitle, index) => {
        //   console.log('columnTitle', columnTitle);
        //   if (!formattedData?.[columnTitle.qFallbackTitle]) {
        //     formattedData[columnTitle.qFallbackTitle] = [row[index]];
        //   } else {
        //     formattedData[columnTitle.qFallbackTitle].push(row[index]);
        //   }
        // });
        if (!formattedData?.[columnTitles[0]?.qFallbackTitle]) {
          formattedData[columnTitles[0].qFallbackTitle] = [row[0]];
        } else {
          formattedData[columnTitles[0].qFallbackTitle].push(row[0]);
        }

        if (!formattedData?.[columnTitles[1]?.qFallbackTitle]) {
          formattedData[columnTitles[1].qFallbackTitle] = [row[1]];
        } else {
          formattedData[columnTitles[1].qFallbackTitle].push(row[1]);
        }

        if (!formattedData?.[columnTitles[2]?.qFallbackTitle]) {
          formattedData[columnTitles[2].qFallbackTitle] = [row[2]];
        } else {
          formattedData[columnTitles[2].qFallbackTitle].push(row[2]);
        }

        if (!formattedData?.[columnTitles[3]?.qFallbackTitle]) {
          formattedData[columnTitles[3].qFallbackTitle] = [row[3]];
        } else {
          formattedData[columnTitles[3].qFallbackTitle].push(row[3]);
        }
      });

      // columnTitles.forEach((columnTitle, columnIndex) => {
      //   formattedData[columnTitle.qFallbackTitle] =
      //     hyperCubeData[0].qMatrix.map((row) => {
      //       return row[columnIndex];
      //     });
      // });

      setxAxis(layout.qHyperCube.qDimensionInfo[0].qFallbackTitle);
      setyAxes(
        layout.qHyperCube.qMeasureInfo.map(
          (columnTitle) => columnTitle.qFallbackTitle
        )
      );
      setData(formattedData);
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
    <ChartWrapper>
      {' '}
      {data && xAxis && yAxes && (
        <LineChart data={data} xAxis={xAxis} yAxes={yAxes} />
      )}
    </ChartWrapper>
  );
};
MultiLineChart.whyDidYouRender = true;
export default MultiLineChart;
