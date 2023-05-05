import { Box, Container } from '@mui/material';
import { SectionIdEnum } from '../types';
import React from 'react';

export type SectionContainerProps = {
  children: React.ReactNode;
  sectionId: SectionIdEnum;
};

export const SectionContainer: React.FC<SectionContainerProps> = ({ children, sectionId }) => {
  return (
    <div id={sectionId} key={sectionId}>
      <Container sx={{
        marginTop: '1rem',
        marginBottom: '1rem',
      }}>
        <Box minHeight='25vh'>{children}</Box>
      </Container>
    </div>
  );
};
