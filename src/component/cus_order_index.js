import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import CusOrderTable from './table/cus_order_table';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const CusOrderIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Order</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Functions</Breadcrumb.Item>
            <Breadcrumb.Item active>Orders</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#EBF2F5',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <CusOrderTable />
    </Panel>
  );
};

export default CusOrderIndex;