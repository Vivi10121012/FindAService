import React from 'react';
import { DOMHelper } from 'rsuite';
import { Layout } from 'antd';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
const { Meta } = Card;
const { Content } = Layout;

const Homepage = () => {
  const cards = [
    {
      title: 'Cleaning',
      color: '#f0f2f5',
      link: '/cleaning',
      cover: 'https://cache.handy-client-assets.com/taxonomy-service/service_faucets_replacement.jpg',
    },
    {
      title: 'Babysitting',
      color: '#e6f7ff',
      link: '/babysitting',
      cover: 'https://compote.slate.com/images/5f52a993-0e74-4b9c-bdd9-5f1c286ec073.png?crop=1180%2C842%2Cx0%2Cy0&width=1440',
    },
    {
      title: 'Pest Control',
      color: '#fffbe6',
      link: '/pest-control',
      cover: 'https://cdn.cdnparenting.com/articles/2018/09/453277711-H-1024x700.webp',
    },
    {
      title: 'Plumbing',
      color: '#fce4d6',
      link: '/plumbing',
      cover: 'https://img.freepik.com/premium-vector/friendly-smiling-cartoon-professional-man-plumber-character-standing-uniform-isolated-white-flat-pipe-repair-tools-working-accessories-bathroom-toilet-set_575670-2220.jpg?w=1480',
    },
    {
      title: '',
      color: '#f9f0f0',
      link: '/electrical-repairs',
      cover: 'https://images01.nicepagecdn.com/page/94/41/website-template-preview-94417.webp',
    },
    {
      title: 'Beauty',
      color: '#fff0f6',
      link: '/beauty',
      cover: 'https://www.odtap.com/wp-content/uploads/2019/03/beauty-banners.png',
    },
  ];

  const { getHeight, on } = DOMHelper;
  return (
      <Layout>
        <Content style={{ padding: '80px' ,backgroundColor:'#F5F5F5',height:getHeight(window)}}>
          <Row gutter={[25, 40]}>
            {cards.map((card) => (
              <Col span={8} key={card.title}>
                <Link to={card.link}>
                  <Card
                    hoverable
                    style={{
                      backgroundColor: card.color,
                      width: 400,
                      height: 250,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundImage: `url(${card.cover})`,
                      backgroundSize: 'cover',

                    }}>
                    <Meta
                      description={card.title}
                      style={{
                        color: 'balck',
                        fontFamily: 'Arial',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
  );
};

export default Homepage;
