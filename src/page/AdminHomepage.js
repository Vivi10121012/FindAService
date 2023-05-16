import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { UserAddOutlined, PlusSquareOutlined, SolutionOutlined, MessageOutlined } from '@ant-design/icons';

function AdminDashboard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Row justify="center" gutter={[24, 24]} style={{ maxWidth: 1200 }}>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            cover={<UserAddOutlined style={{ fontSize: '4em', margin: '20px auto' }} />}
            bodyStyle={{ padding: 20 }}
            style={{ margin: '20px 10px', padding: '20px', height: '100%', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: 10 }}>Verify Service Provider</h3>
            <Button type="primary" href='/admin/AdVerIndex'>Enter</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            cover={<PlusSquareOutlined style={{ fontSize: '4em', margin: '20px auto' }} />}
            bodyStyle={{ padding: 20 }}
            style={{ margin: '20px 10px', padding: '20px', height: '100%', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: 55}}>Notifications</h3>
            <Button type="primary" href='/admin/AdminNotification'>Enter</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            cover={<MessageOutlined style={{ fontSize: '4em', margin: '20px auto' }} />}
            bodyStyle={{ padding: 20 }}
            style={{ margin: '20px 10px', padding: '20px', height: '100%', textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: 10 }}>Review management</h3>
            <Button type="primary" href='/admin/AdminReviewIndex'>Enter</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;
