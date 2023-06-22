import React, { createContext, useContext, useState } from 'react';

export interface Contact {
  name: string;
  address: string;
}

interface AddressBookContextProps {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
}

const AddressBookContext = createContext<AddressBookContextProps>({
  contacts: [],
  addContact: () => {},
});

export const AddressBookProvider = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(JSON.parse(localStorage.getItem('contacts') || '[]'));

  const addContact = (contact: Contact) => {
    setContacts(prevContacts => {
      const updatedContacts = [...prevContacts, contact];
      console.log('Contacts after adding new one: ', updatedContacts);
      return updatedContacts;
    });
  };
  

  return (
    <AddressBookContext.Provider value={{ contacts, addContact }}>
      {children}
    </AddressBookContext.Provider>
  );
};

export const useAddressBook = () => useContext(AddressBookContext);
