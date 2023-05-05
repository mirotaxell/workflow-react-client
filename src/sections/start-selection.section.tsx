import {Box, Typography} from '@mui/material';
import React from 'react';
import {CompanySection} from './company.section';
import {ProjectSection} from './project.section';

type Props = {};
export const StartSelectionSection: React.FC<Props> = () => {
  const userData = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;
  return (
    <Box
      py={4}
      sx={{
        boxShadow: 2,
        borderRadius: '5px',
        backgroundColor: 'rgb(244, 244, 244)',
        padding: '2rem',
      }}
    >
      <Typography variant="h4" sx={{textAlign: 'center'}}>
        Welcome {userData?.full_name}!
      </Typography>
      <Typography variant="h6" sx={{textAlign: 'center'}}>
        Start by selecting a company and project, or creating new ones.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <CompanySection />
        <ProjectSection />
      </Box>
    </Box>
  );
};
