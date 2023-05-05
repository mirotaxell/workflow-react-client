import {
  Close,
  Logout,
  Menu as MenuIcon,
  PersonAdd,
  Settings,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  Hidden,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import {TransitionProps} from '@mui/material/transitions';
import React, {useContext, useState} from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import {SectionIdEnum} from '../types';
import {useApolloClient} from '@apollo/client';
import {Context} from '../App';

export type NavigationProps = {
  isSmall: boolean;
};

const navigationItems = [
  {
    text: 'Setup',
    to: SectionIdEnum.startSelection,
  },
  {
    text: 'Tracking',
    to: SectionIdEnum.timeTracking,
  },
  {
    text: 'Reports',
    to: SectionIdEnum.reports,
  },
  {
    text: 'Inventory',
    to: SectionIdEnum.inventory,
  },
];

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction="left" ref={ref} {...props} />;
  }
);

export const Navigation: React.FC<NavigationProps> = ({isSmall}) => {
  
  const userData = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null;
  const client = useApolloClient();
  const [open, setOpen] = useState(false);

  const onOpenHandler = () => setOpen(true);
  const onCloseHandler = () => setOpen(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openAccountMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const mappedItems = navigationItems.map(({to, text}) => {
    return (
      <AnchorLink
        key={to}
        href={`#${to}`}
        offset={isSmall ? '56px' : '64px'}
        className="all_unset"
      >
        <Button
          color="inherit"
          size="large"
          fullWidth={isSmall}
          onClick={onCloseHandler}
        >
          {text}
        </Button>
      </AnchorLink>
    );
  });

  return (
    <>
      <React.Fragment>
        <Hidden smDown>
          <Box display="flex" gap={2}>
            {mappedItems}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ml: 2}}
                aria-controls={openAccountMenu ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openAccountMenu ? 'true' : undefined}
              >
                <Avatar sx={{width: 32, height: 32}}>M</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Hidden>
        <Hidden smUp>
          <IconButton color="inherit" onClick={onOpenHandler}>
            <MenuIcon />
          </IconButton>
          <Dialog
            open={open}
            fullScreen
            fullWidth
            TransitionComponent={Transition}
            hideBackdrop
            PaperProps={{
              sx: {
                boxShadow: 'none',
              },
            }}
          >
            <AppBar
              position="static"
              sx={{background: 'white', color: 'text.primary'}}
            >
              <Toolbar>
                <Typography variant="h5" sx={{flexGrow: 1}}>
                  Menu
                </Typography>
                <IconButton color="inherit" onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Box display="flex" flexDirection="column" py={3} width="100%">
              {mappedItems}
              <Tooltip title="Account settings">
                <Button
                  onClick={handleClick}
                  size="small"
                  aria-controls={openAccountMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAccountMenu ? 'true' : undefined}
                >
                  <Avatar sx={{width: 32, height: 32}}>M</Avatar>
                </Button>
              </Tooltip>
            </Box>
          </Dialog>
        </Hidden>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openAccountMenu}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> {userData?.full_name}
          </MenuItem>
          <Divider />

          <MenuItem
            onClick={() => {
              localStorage.clear();
              client.clearStore().then(() => {
                client.resetStore();
              });
              handleClose;
              window.location.reload();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    </>
  );
};
