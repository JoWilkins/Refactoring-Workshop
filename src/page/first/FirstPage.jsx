import { useEffect, useState } from 'react';
import LineChart from './LineChart';
import { ChartsContainer, Row, Column } from '../../LayoutComponents';

const FirstPage = ({ qlikApp, objectId }) => {
  const [data, setData] = useState();
  const [xAxis, setxAxis] = useState();
  const [yAxes, setyAxes] = useState();

  // Gets the object, and adds a listener to get the data
  useEffect(() => {
    let qlikObject;
    const getData = async () => {
      // Getting data from qlik
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

      // Formatting the qlik data into somethign usable by the line chart
      const formattedData = {};
      // iterate through the columnTitles array and recreate narrowed down arrays of data points for each column
      columnTitles.forEach((columnTitle, columnIndex) => {
        formattedData[columnTitle.qFallbackTitle] =
          hyperCubeData[0].qMatrix.map((row) => {
            return row[columnIndex];
          });
      });

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
    <ChartsContainer>
      <Row width={100} size={1}>
        <Column width={1}></Column>{' '}
        {data && xAxis && yAxes && (
          <LineChart data={data} xAxis={xAxis} yAxes={yAxes} />
        )}
      </Row>
    </ChartsContainer>
  );
};
FirstPage.whyDidYouRender = true;
export default FirstPage;
