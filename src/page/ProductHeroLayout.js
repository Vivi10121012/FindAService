import * as React from 'react';
import PropTypes from 'prop-types';

import { Container, Header, Content, Footer, Sidebar } from 'rsuite';
// import Box from '@mui/material/Box';

// const ProductHeroLayoutRoot = (({ theme }) => ({
//   color: 'white',
//   position: 'relative',
//   display: 'flex',
//   alignItems: 'center',
//   [theme.breakpoints.up('sm')]: {
//     height: '80vh',
//     minHeight: 500,
//     maxHeight: 1300,
//   },
// }));

const Backgroundstyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
};

function ProductHeroLayout(props) {
//   const { sxBackground, children } = props;

  return (
    // <ProductHeroLayoutRoot>
      <Container

      >
        {/* <img
          src="/static/themes/onepirate/productHeroWonder.png"
          alt="wonder"
          width="147"
          height="80"
        /> */}
        {/* {children} */}
        <Content
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'common.black',
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <image style={Backgroundstyle}></image>
        {/* <Background sx={sxBackground} /> */}
      </Container>
    //  </ProductHeroLayoutRoot>
  );
}

ProductHeroLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default ProductHeroLayout;