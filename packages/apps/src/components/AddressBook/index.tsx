import React, { useContext, useState } from 'react';
import { Table, Button, TextField, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAddressBook } from '../../contexts/AddressBookContext/index.tsx';

export const AddressBook = () => {
  const { contacts, addContact, setError, error } = useAddressBook();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.MouseEvent<HTMLButtonElement>, forceClose?: boolean) => {
    if (event) {
      event.stopPropagation(); // Prevent event from propagating up to form
    }
  
    // Only close the modal if there's no error or if we want to force close
    if (!error || forceClose) { 
      setOpen(false);
      setName(""); // Reset name
      setAddress(""); // Reset address
      setError(null); // Reset error
    }
  };
  
  

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const success = await addContact({ name, address });
    if (success) {
      console.log('New Contact: ', { name, address });
      handleClose();
    }
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

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
            <form onSubmit={handleSubmit}>
                <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
                <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} />
                {
                  error && <div className="error">{error}</div>
                }
            </form>
        </DialogContent>
        <DialogActions>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
            <Button onClick={(event) => handleClose(event, true)}>Close</Button>
        </DialogActions>
    </Dialog>
    </>
  );
};
