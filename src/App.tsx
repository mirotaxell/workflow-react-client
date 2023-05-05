import * as React from 'react';
import './styles.css';
import LoginForm from './components/login';
import {useState} from 'react';
import {checkToken} from './utils/checkToken';
import {InventorySection} from './sections/inventory.section';
import {ReportsSection} from './sections/reports.section';
import {StartSelectionSection} from './sections/start-selection.section';
import {TrackingSection} from './sections/tracking.section';
import {SectionIdEnum} from './types';
import {MainLayout, SectionContainer} from './components';
import Footer from './components/footer';

export const Context = React.createContext(null as any);

const sections = [
  {
    sectionId: SectionIdEnum.startSelection,
    component: <StartSelectionSection />,
  },
  {
    sectionId: SectionIdEnum.timeTracking,
    component: <TrackingSection />,
  },
  {
    sectionId: SectionIdEnum.reports,
    component: <ReportsSection />,
  },
  {
    sectionId: SectionIdEnum.inventory,
    component: <InventorySection />,
  },
];

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  const [projectContext, setProjectContext] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [userContext, setUserContext] = useState('');

  

  if (!token) {
    return (
      <Context.Provider
        value={{
          projectContext: projectContext,
          setProjectContext: setProjectContext,
          companyContext: companyContext,
          setCompanyContext: setCompanyContext,
        }}
      >
        <div className="App">
          <LoginForm />
        </div>
      </Context.Provider>
    );
  }
  checkToken(token)
    .then((res) => {
      if (!res) {
        localStorage.removeItem('token');
        return (
          <Context.Provider
            value={{
              projectContext: projectContext,
              setProjectContext: setProjectContext,
              companyContext: companyContext,
              setCompanyContext: setCompanyContext,
            }}
          >
            <div className="App">
              <LoginForm />
            </div>
          </Context.Provider>
        );
      }
    })
    .catch((err) => {
      console.log(err);
      return (
        <div className="App">
          <h1>Something went wrong</h1>
        </div>
      );
    });
  return (
    <Context.Provider
      value={{
        user: userContext,
        setUserContext: setUserContext,
        project: projectContext,
        setProjectContext: setProjectContext,
        company: companyContext,
        setCompanyContext: setCompanyContext,
      }}
    >
      <div className="App">
        <MainLayout>
          {sections.map(({component, sectionId}) => {
            return (
              <SectionContainer sectionId={sectionId} key={sectionId}>
                {component}
              </SectionContainer>
            );
          })}
          
          <div style={{height: '100px'}}></div>
          <Footer />
        </MainLayout>
      </div>
    </Context.Provider>
  );
};

export default App;
