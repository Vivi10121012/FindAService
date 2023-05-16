import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { UserAddOutlined, PlusSquareOutlined, SolutionOutlined, MessageOutlined, UnorderedListOutlined, ShoppingOutlined } from '@ant-design/icons';

function ServiceProDashboard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Row justify="center" align="middle" gutter={[48, 48]} style={{ maxWidth: 1200 }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            cover={<UnorderedListOutlined style={{ fontSize: '6em', margin: '40px auto' }} />}
            bodyStyle={{ padding: 40 }}
            style={{ margin: '40px', padding: '40px', width: '100%', height: 400, textAlign: 'center' }}
          >
            <h3 style={{ marginBottom: 20 }}>Service List</h3>
            <Button type="primary" size="large" href='/provider/ServiceIndex'>Enter</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            cover={<ShoppingOutlined style={{ fontSize: '6em', margin: '40px auto' }} />}
            bodyStyle={{ padding: 40 }}
            style={{ margin: '40px', padding: '40px', width: '100%', height: 400, textAlign: 'center' } }
          >
            <h3 style={{ marginBottom: 20 }} >Notification List</h3>
            <Button type="primary" size="large" href='/provider/NotiproIndex'>Enter</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ServiceProDashboard;
