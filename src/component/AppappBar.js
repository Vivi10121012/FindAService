import React, { Component } from 'react';
import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import CogIcon from '@rsuite/icons/legacy/Cog';
import ReactDOM from 'react-dom';
//首页bar
const AppappBar = ({ onSelect, activeKey, ...props }) => {
  return (
    <Navbar {...props}>
      <Navbar.Brand href="/#">Find a Service</Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon />}>
          Home
        </Nav.Item>
        <Nav.Item eventKey="2">News</Nav.Item>
        <Nav.Item eventKey="3">Services</Nav.Item>
        <Nav.Menu title="About">
          <Nav.Item eventKey="4">Company</Nav.Item>
          <Nav.Item eventKey="5">Team</Nav.Item>
          <Nav.Item eventKey="6">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      <Nav pullRight>
        <Navbar.Brand href="/#/login">Sign In</Navbar.Brand>
        <Navbar.Brand href="/#/login">Sign Up</Navbar.Brand>
        {/* <Nav.Item icon={<CogIcon /> } href="/#/login" >Settings</Nav.Item> */}
      </Nav>
    </Navbar>
  );
};

export default AppappBar;