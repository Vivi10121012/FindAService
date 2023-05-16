import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from 'react-router-dom';
import HomePageAbout from './About';
import InitialHomePage from './Home';
import Brand from '../../Brand';
import './tokyo.css'
import './dark.css'

const brandcss = {
  padding: "5px 10px",
  fontSize: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  fontWeight: "bold",
  textTransform: "uppercase"
}

const HomeView = (props) => {
  const [tabIndex, setTabIndex] = useState(props.tabIndex);

  return (
    <>
    <div className="tokyo_tm_all_wrap">
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <div className="leftpart">
            <div className="leftpart_inner">
              <div className="logo">
                <Link className="navbar-brand" to="/">
                <Brand style={brandcss}></Brand>
                </Link>
              </div>

              <div className="menu">
                <ul>
                  <Tab>
                    <span className="menu_content">Home</span>
                  </Tab>

                  <Tab>
                    <span className="menu_content">About</span>
                  </Tab>
                </ul>
              </div>
            </div>
          </div>
        </TabList>

        <div className="rightpart">
          <div className="rightpart_in">
            <div className="tokyo_tm_section">
              <div className="container">
                <TabPanel>
                  <InitialHomePage />
                </TabPanel>

                <TabPanel>
                  <HomePageAbout />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
      </div>
    </>
  );
};

export default HomeView;