import {
  faCode,
  faCog,
  faFileAlt,
  faPlus,
  faUsers,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const isActive = (pathname: string) => {
    return location.pathname === pathname;
  };

  return (
    <div className='sidebar-container'>
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary='Supersig' />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding style={{ paddingLeft: '1.5em' }}>
            <ListItem
              className={
                isActive('/organisations/dashboard')
                  ? 'active-link sidebar-button'
                  : 'sidebar-button'
              }
              component={Link}
              to='/organisations/dashboard'
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  style={{ marginRight: '5px' }}
                />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
            <ListItem
              className='sidebar-button'
              component={Link}
              to='/organisations/create'
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
              </ListItemIcon>
              <ListItemText primary='Create' />
            </ListItem>
            <ListItem
              className='sidebar-button'
              component={Link}
              to='/organisations/create'
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  style={{ marginRight: '5px' }}
                />
              </ListItemIcon>
              <ListItemText primary='Propose' />
            </ListItem>
            <ListItem
              className={
                isActive('/organisations/decode')
                  ? 'active-link sidebar-button'
                  : 'sidebar-button'
              }
              component={Link}
              to='/organisations/decode'
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faCode} style={{ marginRight: '5px' }} />
              </ListItemIcon>
              <ListItemText primary='Decode' />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          className={
            isActive('/wallet/accounts')
              ? 'active-link sidebar-button'
              : 'sidebar-button'
          }
          component={Link}
          to='/wallet/accounts'
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faWallet} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary='Accounts' />
        </ListItem>

        <ListItem
          className={
            isActive('/settings')
              ? 'active-link sidebar-button'
              : 'sidebar-button'
          }
          component={Link}
          to='/settings'
        >
          <ListItemIcon>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: '5px' }} />
          </ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;