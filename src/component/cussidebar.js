import { Container, Sidebar, Sidenav, Content, Navbar, Nav, DOMHelper } from 'rsuite';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import DashboardIcon from '@rsuite/icons/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Brand from './Brand';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';
import MoreIcon from '@rsuite/icons/More';
import { Link } from 'react-router-dom';

const brandcss = {
  padding: "10px 18px",
  fontSize: "16px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  fontWeight: "bold",
  textTransform: "uppercase"
}

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const { getHeight, on } = DOMHelper;

const CusSidebarpro = () => {
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));

  useEffect(() => {
    setWindowHeight(getHeight(window));
    const resizeListenner = on(window, 'resize', () => setWindowHeight(getHeight(window)));

    return () => {
      resizeListenner.off();
    };
  }, []);

  const containerClasses = classNames('page-container', {
    'container-full': !expand
  });

  return (
    <Container className="frame" style={{ height: "100vh" }}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          {/* <img src={icon1} style={brandcss}/> */}
          <Brand style={brandcss}></Brand>
        </Sidenav.Header>
        <Sidenav expanded={expand} appearance="subtle" defaultOpenKeys={['2', '3']}>
          <Sidenav.Body style={{ height: windowHeight - 100, overflow: 'hidden' }}>
            <Nav>
            <Nav.Item eventKey="1" active icon={<DashboardIcon />} href='/cus'>
                Home 
              </Nav.Item>
              <Nav.Menu
                eventKey="2"
                trigger="hover"
                title="Functions"
                icon={<GearCircleIcon />}
                placement="rightStart"
              >
                {/* 跳转 */}
                <Nav.Item eventKey="2-1" href='/cus/CusserIndex'>Services</Nav.Item>
                <Nav.Item eventKey="2-2" href='/cus/CusOrder'>Orders</Nav.Item>
                <Nav.Item eventKey="2-2" href='/cus/CusNotification'>Notification</Nav.Item>
              </Nav.Menu>
              <Nav.Item eventKey="2" icon={<HelpOutlineIcon />}>
                Help
              </Nav.Item>
              <Nav.Item eventKey="2" icon={<InfoOutlineIcon />}>
                Information 
              </Nav.Item>
              <Nav.Menu
                eventKey="5"
                trigger="hover"
                title="Settings"
                icon={<GroupIcon />}
                placement="rightStart"
              >
                {/* 跳转 */}
                <Nav.Item eventKey="5-1" >Accout </Nav.Item>
                <Nav.Item eventKey="5-2">Sign Out</Nav.Item>
              </Nav.Menu>
              <Nav.Item eventKey="2" icon={< MoreIcon/>}>
                More
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>

      <Container className={containerClasses} >
        <Header />
        <Content>
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
}
export default CusSidebarpro;