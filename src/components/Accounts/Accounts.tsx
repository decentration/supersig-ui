import React, { useContext, useState } from 'react';
import '../Dashboard/Dashboard.css';
import './Accounts.css';

import AccountsTable from './AccountsTable';
import { ChainContext } from '../../contexts/ChainContext';

const Accounts: React.FC = () => {
  const { selectedChain } = useContext(ChainContext);
  const [showEmptyBalances, setShowEmptyBalances] = useState(false);
  console.log(selectedChain);
  const handleToggleChange = () => {
    setShowEmptyBalances(!showEmptyBalances);
  };

  const Summary: React.FC<{ title: string; value: any }> = ({
    title,
    value,
  }) => (
    <div className='summary-item'>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

  return (
    <div className='accounts-general'>
      <h1>Accounts</h1>
      {selectedChain && (
        <div className='summary-section'>
          <Summary title='Chain Name' value={selectedChain.name} />
          <Summary title='Chain Decimals' value={selectedChain.decimals} />
        </div>
      )}

      <div className='empty-balance-input'>
        <input
          type='checkbox'
          checked={showEmptyBalances}
          onChange={handleToggleChange}
        />
        <label>show empty balances</label>
      </div>

      <AccountsTable showEmptyBalances={showEmptyBalances} />
    </div>
  );
};

export default Accounts;
