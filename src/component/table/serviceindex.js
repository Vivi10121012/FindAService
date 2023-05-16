import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AllServiceprotable from './AllServiceprotable';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const ServiceIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">All Service</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Functions</Breadcrumb.Item>
            <Breadcrumb.Item active>All Service</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#F6F8FA',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <AllServiceprotable />
    </Panel>
  );
};

export default ServiceIndex;