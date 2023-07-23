// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import React, { useState } from 'react';

import { useAddressBook } from '../../contexts/AddressBookContext/index.js';

export const AddressBook = () => {
  const { addContact, contacts, error, setError } = useAddressBook();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event?: any, forceClose?: boolean) => {
    if (event) {
      event.stopPropagation(); // Prevent event from propagating up to form
    }

    // Only close the modal if there's no error or if we want to force close
    if (!error || forceClose) {
      setOpen(false);
      setName(''); // Reset name
      setAddress(''); // Reset address
      setError(null); // Reset error
    }
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    const doSubmit = async () => {
      event.preventDefault();
      const success = await addContact({ address, name });

      if (success) {
        handleClose();
      }
    };

    doSubmit();
  };

  return (
    <>
      <Button onClick={handleOpen}>Create Contact</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact, i) => (
            <TableRow key={i}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        onClose={(e) => handleClose(e, false)}
        open={open}
      >
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label='Name'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              label='Address'
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            {
              error && <div className='error'>{error}</div>
            }
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            type='submit'
          >Submit</Button>
          <Button onClick={(event) => handleClose(event, true)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
