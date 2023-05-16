import * as React from 'react';
import AppappBar from '../component/AppappBar';
import ProductHero from './ProductHero';

function Home() {
  const [activeKey, setActiveKey] = React.useState(null);
  return (
    <AppappBar appearance="subtle" activeKey={activeKey} onSelect={setActiveKey} />
    // <ProductHero></ProductHero>

  );
}

export default Home;