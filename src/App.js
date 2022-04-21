import { useEffect, useState } from 'react';
import styled from 'styled-components';
import QlikConnector from './enigma/qlikConnector';
import MultiLineChart from './MutliLineChart';
import Navbar from './Navbar';
import Tab from './Tab';

const AppWrapper = styled.div`
  background-color: #515e70;
  display: flex;
  flex-direction: column;
  color: black;
  height: 100%;
  width: 100%;
`;

const TabBoxContainer = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 100%;
`;

const TabsWrapper = styled.div`
  color: white;
  background-color: #414141;
  display: flex;
  flex-direction: row;
`;

const tabs = [
  {
    label: 'first',
  },
  {
    label: 'second',
  },
];

const App = () => {
  const [qlikApp, setQlikApp] = useState();
  const [selectedTab, setSelectedTab] = useState('first');

  useEffect(() => {
    const getQlikApp = async () => {
      const sourcedQlikApp = await QlikConnector(
        'e0a475b9-62fd-4313-a650-4d865baca5e1'
      );
      setQlikApp(sourcedQlikApp);
    };
    if (!qlikApp) {
      getQlikApp();
    }
  }, []);

  return (
    <AppWrapper>
      <Navbar logo={'Some Long Title'} links={{}} />
      <TabBoxContainer>
        <TabsWrapper>
          {tabs.map((tabObject) => {
            return (
              <Tab
                key={tabObject.label}
                label={tabObject.label}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            );
          })}
        </TabsWrapper>
        {selectedTab === 'first' && (
          <MultiLineChart qlikApp={qlikApp} objectId={'mCjTgdm'} />
        )}
        {selectedTab === 'second' && <div>Test</div>}
      </TabBoxContainer>
      {/* {qlikApp && <MultiLineChart qlikApp={qlikApp} objectId={'mCjTgdm'} />} */}
    </AppWrapper>
  );
};
App.whyDidYouRender = true;

export default App;
