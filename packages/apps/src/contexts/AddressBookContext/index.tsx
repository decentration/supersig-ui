import React, { createContext, useContext, useState } from 'react';

interface Contact {
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
  const [contacts, setContacts] = useState<Contact[]>([]);

  const addContact = (contact: Contact) => {
    setContacts(prevContacts => [...prevContacts, contact]);
  };

  return (
    <AddressBookContext.Provider value={{ contacts, addContact }}>
      {children}
    </AddressBookContext.Provider>
  );
};

export const useAddressBook = () => useContext(AddressBookContext);
