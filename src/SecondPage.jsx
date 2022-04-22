import { useEffect, useState } from 'react';
import { ChartsContainer, Row, Column } from './LayoutComponents';
import TableComponent from './TableComponent';
import MiniBarChart from './MiniBarChart';

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

const SecondPage = ({ qlikApp, objectId }) => {
  const [data, setData] = useState();
  const [tableData, setTableData] = useState();
  console.log('tableData', tableData);

  // Refactors the raw data (i.e. the qMatrix) from qlik into a format usable by the TableComponent.
  const generateTableData = () => {
    const newTableData = [];
    data.forEach((tableRow, rowIndex) => {
      const rowObject = {};
      headers.forEach((headerObj) => {
        const { keyValue, displayType, sourceDataIndexes } = headerObj;

        // TODO(Jo): Change to a switch statement
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

  // Used to get and set the raw data from the qlik object
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
          {tableData && (
            <TableComponent
              headers={headers}
              data={tableData}
              headersColour={'white'}
            />
          )}
        </Column>
      </Row>
    </ChartsContainer>
  );
};

export default SecondPage;
