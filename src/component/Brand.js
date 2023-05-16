import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from 'rsuite';

const Brand = props => {
  return (
    <Stack className="brand" {...props}>
      <Link to="/">
        <span style={{ marginLeft: 14 }}>Find A Service</span>
      </Link>
    </Stack>
  );
};

export default Brand;