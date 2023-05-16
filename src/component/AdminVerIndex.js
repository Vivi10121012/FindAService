import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AdminVeriTable from './table/adminverification';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const AdVerIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Verification</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Operations</Breadcrumb.Item>
            <Breadcrumb.Item active>Verification</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#EBF2F5',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <AdminVeriTable />
    </Panel>
  );
};

export default AdVerIndex;