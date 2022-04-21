import { useEffect, useState } from 'react';
import QlikConnector from './enigma/qlikConnector';
import MultiLineChart from './MutliLineChart';

const App = () => {
  const [qlikApp, setQlikApp] = useState();

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
    <div>
      {qlikApp && <MultiLineChart qlikApp={qlikApp} objectId={'mCjTgdm'} />}
    </div>
  );
};
App.whyDidYouRender = true;

export default App;
