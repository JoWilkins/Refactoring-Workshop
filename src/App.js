import { useEffect, useState } from 'react';
import styled from 'styled-components';
import QlikConnector from './enigma/qlikConnector';
import FirstPage from './page/first/FirstPage.jsx';
import Navbar from './navComponents/Navbar';
import Tab from './navComponents/Tab';
import SecondPage from './SecondPage';

const AppWrapper = styled.div`
  background-color: #515e70;
  display: flex;
  flex-direction: column;
  color: white;
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
  const [selectedTab, setSelectedTab] = useState('second');

  // gettign the qlik app and setting to state on first load of page
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
          <FirstPage qlikApp={qlikApp} objectId={'mCjTgdm'} />
        )}
        {selectedTab === 'second' && (
          <SecondPage qlikApp={qlikApp} objectId={'WphfMw'} />
        )}
      </TabBoxContainer>
    </AppWrapper>
  );
};
App.whyDidYouRender = true;

export default App;
