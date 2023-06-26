import { Button } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { ApiPromise } from '@polkadot/api';
import { useState } from 'react';
import { keyring } from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/keyring';

const Settings = () => {
  const [currentStep, setCurrentStep] = useState("");
  const [processMessage, setProcessMessage] = useState("Click test button to begin");
  const [endpoint, setEndpoint] = useState('soupcan1.jelliedowl.com');
  const { api, isApiReady } = useApi();
  const [status, setStatus] = useState({
    chainWorking: false,
    palletExists: false,
    rpcMethodsExist: false,
    supersigCreated: false,
    balanceSent: false,
    proposalCreated: false,
    voteSubmitted: false,
    superSigDeletionProposed: false,
    voteDeleteSubmitted: false
  });
  const [output, setOutput] = useState({
    chainWorking: '',
    palletExists: '',
    rpcMethodsExist: '',
    supersigCreated: '',
    balanceSent: '',
    proposalCreated: '',
    voteSubmitted: '',
    superSigDeletionProposed: '',
    voteDeleteSubmitted: '',
  });
  const [error, setError] = useState({
    chainWorking: false,
    palletExists: false,
    rpcMethodsExist: false,
    supersigCreated: false,
    balanceSent: false,
    proposalCreated: false,
    voteSubmitted: false,
    superSigDeletionProposed: false,
    voteDeleteSubmitted: false
  });
  

  const handleClick = async () => {
    if (!isApiReady) return;

    let superSigAccount = ''; // We'll update this after creating the SuperSig
    let amount = 0; // Update this after sending balance
    let callId = 0; // Update this after submitting the call

const checkChain = async (api: ApiPromise) => {
  try {
    // check the chain
    const chain = await api.rpc.system.chain();
    setStatus(prev => ({ ...prev, chainWorking: true }));
  } catch (error) {
    throw new Error("Unable to connect to the chain");
  }
}

const checkPallet = async (api: ApiPromise) => {
  try {
    // check if the chain is working before proceeding
    if (!status.chainWorking) {
      throw new Error("Chain connection failed. Cannot proceed to check pallet");
    }

    const pallets = Object.keys(api.tx);
    if (pallets.includes('supersig')) {
      setStatus(prev => ({ ...prev, palletExists: true }));
    } else {
      throw new Error("Pallet 'supersig' does not exist");
    }
  } catch (error) {
    throw new Error("An error occurred while checking for the pallet: " + error.message);
  }
}

const checkRpcMethods = async (api: ApiPromise) => {
  try {
    // check if the chain and pallet checks were successful before proceeding
    if (!status.chainWorking || !status.palletExists) {
      throw new Error("Previous checks failed. Cannot proceed to check RPC methods");
    }

    if ((api.rpc as any).superSig) {
      setStatus(prev => ({ ...prev, rpcMethodsExist: true }));
    } else {
      throw new Error("'superSig' RPC methods do not exist");
    }
  } catch (error) {
    throw new Error("An error occurred while checking RPC methods: " + error.message);
  }
}

      


    const submitAndFinalize = async (tx: any, sender: any): Promise<string> => {
        return new Promise((resolve, reject) => {
          tx.signAndSend(sender, ({ events = [], status }) => {
            if (status.isInBlock) {
              console.log('Included at block hash', status.asInBlock.toHex());
            } else if (status.isFinalized) {
              console.log('Finalized block hash', status.asFinalized.toHex());
              resolve(status.asFinalized.toHex() as string);
            }
          }).catch((error: any) => {
            reject(error);
          });
        });
      }
      
    
      
      const createSupersig = async (api: ApiPromise) => {
        return new Promise(async (resolve, reject) => {
            try {
                setCurrentStep("creating supersig");
                const keyring = new Keyring({ type: 'sr25519' });
                const alice = keyring.addFromUri('//Alice');
                setProcessMessage('creating supersig...');
                const encodedCallData = '0x2a0004d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d00';
                const tx = api.createType('Call', encodedCallData);
                const extrinsic = api.tx(tx);
    
                await extrinsic.signAndSend(alice, ({ events = [], status }) => {
                    if (status.isInBlock) {
                        console.log(`Included at blockHash ${status.asInBlock}`);
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                            
                            // Look for the SupersigCreated event and extract the SuperSig account ID
                            if (section === 'supersig' && method === 'SupersigCreated') {
                                const superSigAccount = data[0];
                                console.log('SuperSig account:', superSigAccount.toString());
                                setStatus(prev => ({ ...prev, supersigCreated: true }));
                                setProcessMessage('SuperSig created. Waiting for next operation...');
                                setOutput(prev => ({ ...prev, supersigCreated: 'SuperSig created with account ' + superSigAccount }));
                                resolve(superSigAccount);
                            }
                        });
                    }
                    else if (status.isFinalized) {
                        console.log(`Finalized at blockHash ${status.asFinalized}`);
                    }
                });
            } catch (error) {
                console.error('Error creating SuperSig:', error);
                reject('Error creating SuperSig');
            }
        });
    };
    

    const sendBalance = async (api: ApiPromise) => {
        try {
            setCurrentStep("send balance from supersig");

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
            amount = 100000;
            console.log(superSigAccount)
            setProcessMessage('funding the supersig...');
            // const txHash = await api.tx.balances.transfer(superSigAccount, amount).signAndSend(alice);
            const txHash = await submitAndFinalize(api.tx.balances.transfer(superSigAccount, amount), alice);
            console.log('Transfer hash:', txHash);
            setStatus(prev => ({ ...prev, balanceSent: true }));
            setOutput(prev => ({ ...prev, balanceSent: 'Sent ' + amount + ' balance to ' + superSigAccount }));
        } catch (error) {
          console.error('Error sending balance:', error);
        }
    }
      
    const submitCall = async (api: ApiPromise) => {
        try {
            setCurrentStep("create supersig proposal");
    
            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
            const dave = keyring.addFromUri('//Dave');
    
            setProcessMessage('Alice is making a proposal to send funds to the supersig from Dave...');
            
            // Create an AccountId instance for Dave's address
            const daveAccountId = api.createType('AccountId', dave.address);
    
            const unsub = await api.tx.supersig.submitCall(superSigAccount, api.tx.balances.transfer(daveAccountId, api.consts.balances.existentialDeposit))
                .signAndSend(alice, ({ status, events }) => {
                    if (status.isInBlock) {
                        console.log(`Transaction included at blockHash ${status.asInBlock}`);
                    } else if (status.isFinalized) {
                        console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                        events.forEach(({ event: { data, method, section }, phase }) => {
                            if (section === 'supersig' && method === 'CallSubmitted') {
                                console.log('Event data:', data.toJSON()); // Log the entire event data
                                const callId = data[0].toHuman(); // Assuming the callId is the first argument of the event
                                console.log(`CallId from CallSubmitted event: ${callId}`);
                                setStatus(prev => ({ ...prev, proposalCreated: true }));
                                setProcessMessage('Proposal created. Waiting for next operation...');
                                setOutput(prev => ({ ...prev, proposalCreated: 'Created proposal with ID ' + callId }));
                                unsub(); // Unsubscribe from the transaction updates
                            }
                        });
                    }
                });
        } catch (error) {
            console.error('Error submitting call:', error);
        }
    }
    
      
    
    const approveCall = async (api: ApiPromise) => {
        try {

            setCurrentStep("approving supersig proposal");

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
    
            setProcessMessage('Alice votes to approve the proposal...');
            const txHash = await submitAndFinalize(api.tx.supersig.approveCall(superSigAccount, callId), alice);
        
            console.log('Approve call hash:', txHash);
            setStatus(prev => ({ ...prev, voteSubmitted: true }));
            setProcessMessage('Proposal Approved. Waiting for next operation...');
            setOutput(prev => ({ ...prev, voteSubmitted: 'Approved call with ID ' + callId }));
        } catch (error) {
          console.error('Error approving call:', error);
        }
    }
    
    const proposeDeleteSupersig = async (api: ApiPromise) => {
        try {
          setCurrentStep("create supersig proposal");
      
          const keyring = new Keyring({ type: 'sr25519' });
          const alice = keyring.addFromUri('//Alice');
      
          setProcessMessage('Alice is making a proposal to delete the supersig...');
          
          const unsub = await api.tx.supersig.submitCall(alice, api.tx.supersig.deleteSupersig(superSigAccount))
          .signAndSend(alice, ({ status, events }) => {
              if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
              } else if (status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                events.forEach(({ event: { data, method, section }, phase }) => {
                  if (section === 'supersig' && method === 'CallSubmitted') {
                    console.log('Event data:', data.toJSON()); // Log the entire event data
                    callId = data[0].toHuman(); // Assuming the callId is the first argument of the event
                    console.log(`CallId from CallSubmitted event: ${callId}`);
                    setStatus(prev => ({ ...prev, supersigDeletionProposed: true }));
                    setProcessMessage('Proposal created. Waiting for next operation...');
                    setOutput(prev => ({ ...prev, supersigDeletionProposed: 'Created proposal with ID ' + callId }));
                    unsub(); // Unsubscribe from the transaction updates
                  }
                });
              }
            });
        } catch (error) {
          console.error('Error submitting call:', error);
        }
      }


      const approveDeleteSupersig = async (api: ApiPromise) => {
        try {

            setCurrentStep("approving supersig proposal");

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
    
            setProcessMessage('Alice votes to approve the proposal to delete the supersig...');
            const txHash = await submitAndFinalize(api.tx.supersig.approveCall(superSigAccount, callId), alice);
        
            console.log('Approve call hash:', txHash);
            setStatus(prev => ({ ...prev, voteDeleteSubmitted: true }));
            setProcessMessage('Proposal Approved. Waiting for next operation...');
            setOutput(prev => ({ ...prev, voteDeleteSubmitted: 'Approved call with ID ' + callId }));
        } catch (error) {
          console.error('Error approving call:', error);
        }
    }

    const deleteSupersig = async (api: ApiPromise) => {
        try {
            setCurrentStep("deleting supersig");
    
            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
    
            setProcessMessage('Alice submits a call to delete the supersig...');
    
            const txHash = await submitAndFinalize(api.tx.supersig.submitCall(superSigAccount, api.tx.supersig.deleteSupersig(superSigAccount)), alice
            );
        
            console.log('Delete SuperSig hash:', txHash);
            setStatus(prev => ({ ...prev, superSigDelet: true }));
            setProcessMessage('Supersig deleted. Process Completed!');
            setOutput(prev => ({ ...prev, superSigDeleted: 'Deleted SuperSig with account ' + superSigAccount }));
        } catch (error) {
          console.error('Error deleting SuperSig:', error);
        }
    }
    
    
      
    await checkChain();
    await checkPallet(api);
    await checkRpcMethods(api);
    await createSupersig(api);
    await sendBalance(api);
    await submitCall(api);
    await approveCall(api);
    await proposeDeleteSupersig(api);
    await approveDeleteSupersig(api);

  }

  return (
    <div>
      <h1>Supersig Workflow Tester</h1>
      <label>
        Endpoint:
        <input type="text" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </label>
      <Button onClick={handleClick}>Test</Button>
      <h5> Current Status... {processMessage}</h5>
      {/* Display the status of each step */}
      {Object.entries(status).map(([key, value]) => (
        <div key={key}>
          <div> {value ? '🟢' : '⚪️'} {key.charAt(0).toUpperCase() + key.slice(1)}  {/* Title case the key */}
         
          <p>{output[key as keyof typeof output]}</p>
         
          </div>
        </div>
      ))}
    </div>
  );
}

export default Settings;
