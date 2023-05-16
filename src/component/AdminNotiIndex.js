import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AdminNotification from './card/admin_notification';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const AdminNotiIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Notifications</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Operations</Breadcrumb.Item>
            <Breadcrumb.Item active>Notifications</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#EBF2F5',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <AdminNotification />
    </Panel>
  );
};

export default AdminNotiIndex;