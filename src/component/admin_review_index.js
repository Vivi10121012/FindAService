import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import AdminReviewTable from './table/admin_review_table';
import {DOMHelper,} from 'rsuite';
const { getHeight } = DOMHelper;

const AdminReviewIndex = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Review</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Operations</Breadcrumb.Item>
            <Breadcrumb.Item active>Review</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
      style={{background: '#F6F8FA',borderRadius:'0',height:Math.max(getHeight(window)),padding:'0px'}}
    >
      <AdminReviewTable />
    </Panel>
  );
};

export default AdminReviewIndex;