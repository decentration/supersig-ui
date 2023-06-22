import React, { useContext, useState } from 'react';
import { Table, Button, Modal, TextField, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAddressBook } from '../../contexts/AddressBookContext/index.tsx';

export const AddressBook = () => {
  const { contacts, addContact } = useAddressBook();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('Adding contact with name: ', name, ' and address: ', address); // add this line
    addContact({ name, address });
    handleClose();
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
            {contacts.map((contact: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; address: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => (
                <TableRow key={i}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.address}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
                <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} />
            </form>
        </DialogContent>
        <DialogActions>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>

    </>
  );
};