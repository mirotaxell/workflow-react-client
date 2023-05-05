import React, {FC, ReactElement} from 'react';
import {Box, Container, Divider, Grid, Typography} from '@mui/material';

export const Footer: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingTop: '1rem',
        paddingBottom: '1rem',
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="black" variant="h5">
              WorkFlow
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              {`${new Date().getFullYear()} | React | Material UI | GraphQL | Apollo | MongoDB | NodeJS | ExpressJS`}
            </Typography>
            <Divider/>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
