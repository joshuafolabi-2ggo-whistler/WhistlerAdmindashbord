import React from 'react';
import {
  Box,
} from '@mui/material';
import Header from './Header';
import ExTable from './ExTable';


const Dashboard = ({onLogout}) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header onLogout={onLogout} />
      <ExTable />
    </Box>
  );
};

export default Dashboard;
