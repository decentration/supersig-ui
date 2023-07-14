// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './Sidebar.css';

import { faAddressBook, faCode, faCog, faFileAlt, faPlus, faUsers, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
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
            <FontAwesomeIcon
              icon={faUsers}
              style={{ marginRight: '5px' }}
            />
          </ListItemIcon>
          <ListItemText primary='Supersig' />
          {open ? '-' : '+'}
        </ListItemButton>
        <Collapse
          in={open}
          timeout='auto'
          unmountOnExit
        >
          <List
            component='div'
            disablePadding
            style={{ paddingLeft: '1.5em' }}
          >
            <ListItem
              className={
                isActive('/dashboard')
                  ? 'active-link sidebar-button'
                  : 'sidebar-button'
              }
              component={Link}
              to='/dashboard'
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
              to='/extrinsic'
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ marginRight: '5px' }}
                />
              </ListItemIcon>
              <ListItemText primary='Create' />
            </ListItem>
            <ListItem
              className='sidebar-button'
              component={Link}
              to='/extrinsic'
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
                isActive('/decode')
                  ? 'active-link sidebar-button'
                  : 'sidebar-button'
              }
              component={Link}
              to='/decode'
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faCode}
                  style={{ marginRight: '5px' }}
                />
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
            <FontAwesomeIcon
              icon={faWallet}
              style={{ marginRight: '5px' }}
            />
          </ListItemIcon>
          <ListItemText primary='Accounts' />
        </ListItem>
        <ListItem
          className={
            isActive('/address-book')
              ? 'active-link sidebar-button'
              : 'sidebar-button'
          }
          component={Link}
          to='/address-book'
        >
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faAddressBook}
              style={{ marginRight: '5px' }}
            />
          </ListItemIcon>
          <ListItemText primary='Address Book' />
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
            <FontAwesomeIcon
              icon={faCog}
              style={{ marginRight: '5px' }}
            />
          </ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItem>
      </List>
    </div>
  );
};
