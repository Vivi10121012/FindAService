import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import CusServicetable from './customerservice';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const CusserIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Services</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Functions</Breadcrumb.Item>
            <Breadcrumb.Item active>Services</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#F6F8FA',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <CusServicetable />
    </Panel>
  );
};

export default CusserIndex;