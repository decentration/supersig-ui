import { Button } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { ApiPromise } from '@polkadot/api';
import { useState } from 'react';
import { keyring } from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/keyring';

interface Status {
    chainWorking: boolean;
    palletExists: boolean;
    rpcMethodsExist: boolean;
    supersigCreated: boolean;
    balanceSent: boolean;
    transaction: string;
    errorMessage: string;
  }

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
    supersigDeletionProposed: false,
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
    supersigDeletionProposed: '',
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
    supersigDeletionProposed: false,
    voteDeleteSubmitted: false
  });
  
 


  const handleClick = async () => {
    if (!isApiReady) return;

    let superSigAccount = ''; // We'll update this after creating the SuperSig
    let amount = 0; // Update this after sending balance
    let callId = 0; // Update this after submitting the call

    const checkChain = async (api: ApiPromise) => {
        try {
          setProcessMessage('Chain is is being checked');

            await api.rpc.system.chain();
            setStatus(prev => ({ ...prev, chainWorking: true }));
            setOutput(prev => ({ ...prev, chainWorking: 'Chain is working properly' }));
            return true;
        } catch (error) {
            const errorAsError = error as Error;
            setStatus(prev => ({ ...prev, chainWorking: false }));
            setOutput(prev => ({ ...prev, chainWorking: 'Error connecting to the chain: ' + errorAsError.message }));
            return false;
        }
    }
    
    const checkPallet = async (api: ApiPromise) => {
        try {
          setProcessMessage('Checking for supersig pallet');

            const pallets = Object.keys(api.tx);
            if (pallets.includes('supersig')) {
                setStatus(prev => ({ ...prev, palletExists: true }));
                setOutput(prev => ({ ...prev, palletExists: 'Pallet supersig exists' }));
                return true;
            } else {
                throw new Error("Pallet 'supersig' does not exist");
            }
        } catch (error) {
            const errorAsError = error as Error;
            setStatus(prev => ({ ...prev, palletExists: false }));
            setOutput(prev => ({ ...prev, palletExists: 'Error checking pallet: ' + errorAsError.message }));
            return false;
        }
    }
    
    const checkRpcMethods = async (api: ApiPromise, chainWorking: boolean, palletExists: boolean) => {
      try {
        setProcessMessage('Checking for Rpc methods in the node');

        // check if the chain and pallet checks were successful before proceeding
        if (!chainWorking || !palletExists) {
          throw new Error("Previous checks failed. Cannot proceed to check RPC methods");
        }
  
        if ((api.rpc as any).superSig) {
          const metadata = await api.rpc.state.getMetadata()
          console.log(JSON.stringify(metadata.toHuman(), null, 2));
          console.log(Object.keys(api.rpc));
          setStatus(prev => ({ ...prev, rpcMethodsExist: true }));
          setOutput(prev => ({ ...prev, rpcMethodsExist: 'supersig rpc methods exist'}))

          // Next step is called here
          const superSigAccount = await createSupersig(api, status)
        } else {
          throw new Error("'superSig' RPC methods do not exist");
        }
      } catch (error) {
        const errorAsError = error as Error;
        setStatus(prev => ({ ...prev, rpcMethodsExist: false }));
        setOutput(prev => ({ ...prev, rpcMethodsExist: 'Error checking rpc methods: ' + errorAsError.message }));
        throw new Error("An error occurred while checking RPC methods: " + errorAsError.message);
      }
    }
    
    // const createSupersig = async (api: ApiPromise): Promise<string> => {
    //   const keyring = new Keyring({ type: 'sr25519' });
    //   const alice = keyring.addFromUri('//Alice');
    //   const encodedCallData = '0x2a0004d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d00';
    //   const tx = api.createType('Call', encodedCallData);
    //   const extrinsic = api.tx(tx);
    //   let superSigAccount = "";

    //   setStatus(prev => ({ ...prev, supersigCreated: false }));
    //   setOutput(prev => ({ ...prev, supersigCreated: `creating supersig...`}))

    //   extrinsic.signAndSend(alice, ({ events = [], status }) => {
    //     setProcessMessage('Creating a supersig account with a member.');
    //     console.log(`creating a supersig please wait...`);
    //       if (status.isInBlock) {
    //           events.forEach(({ event: { data, method, section } }) => {
    //               if (section === 'supersig' && method === 'SupersigCreated') {
    //                   superSigAccount = data[0].toString();
    //                   console.log(`SuperSigCreated with account ${superSigAccount}`);
    //               }
    //           });
    //       } else if (status.isFinalized) {
    //         setStatus(prev => ({ ...prev, supersigCreated: true }));
    //         setOutput(prev => ({ ...prev, supersigCreated: `A supersig was created: ${superSigAccount}`}))
    //           console.log(`Finalized at blockHash ${status.asFinalized}`);
    //           // Call sendBalance as soon as supersig is created
    //           if (superSigAccount) {
    //             sendBalance(api, superSigAccount);
    //           }
    //       }
    //     }).catch((error: any) => {
    //       const errorAsError = error as Error;
    //       setStatus(prev => ({ ...prev, supersigCreated: false }));
    //       setOutput(prev => ({ ...prev, supersigCreated: `A supersig was created: ${superSigAccount}` + errorAsError.message}))
    //       console.error('Error creating SuperSig:', error);

    //     });
    // };

    // const createSupersig = async (api: ApiPromise): Promise<string> => {
    //   try {
    //     setProcessMessage('Creating a new SuperSig...');
    //     setOutput(prev => ({ ...prev, supersigCreated: 'Creating a new SuperSig...' }));
    
    //     setCurrentStep("Creating SuperSig");
    
    //     const keyring = new Keyring({ type: 'sr25519' });
    //     const alice = keyring.addFromUri('//Alice');
    
    //     // Hardcoded member tuple with Alice as the only member and role as "Standard"
    //     const memberTuples = [[alice.address, "Standard"]];
    
    //     setProcessMessage('Alice is attempting to create a new SuperSig...');
    //     const txHash = await submitAndFinalize(api.tx.supersig.createSupersig(memberTuples), alice);
    
    //     console.log('Create SuperSig hash:', txHash);
    //     setStatus(prev => ({ ...prev, supersigCreated: true }));
    //     setProcessMessage('SuperSig Created. Proceeding to next test...');
    //     setOutput(prev => ({ ...prev, supersigCreated: 'Created SuperSig with hash ' + txHash }));
    
    //     // return the transaction hash for further actions or checks
    //     return txHash;
    //   } catch (error) {
    //     console.error('Error creating SuperSig:', error);
    //     setStatus(prev => ({ ...prev, supersigCreated: false }));
    //     setOutput(prev => ({ ...prev, supersigCreated: 'Error creating SuperSig: ' + error.message }));
    //     throw new Error('Error creating SuperSig: ' + error.message);
    //   }
    // };

    const createSupersig = async (api: ApiPromise): Promise<string> => {
      const keyring = new Keyring({ type: 'sr25519' });
      const alice = keyring.addFromUri('//Alice');
    
      // Hardcoded member tuple with Alice as the only member and role as "Standard"
      const memberTuples = [[alice.address, "Standard"]];
    
      // Creating the transaction
      const extrinsic = api.tx.supersig.createSupersig(memberTuples);
      let superSigAccount = "";
    
      setStatus(prev => ({ ...prev, supersigCreated: false }));
      setOutput(prev => ({ ...prev, supersigCreated: `creating supersig...`}))
    
      extrinsic.signAndSend(alice, ({ events = [], status }) => {
        setProcessMessage('Creating a supersig account with a member.');
        console.log(`creating a supersig please wait...`);
          if (status.isInBlock) {
              events.forEach(({ event: { data, method, section } }) => {
                  if (section === 'supersig' && method === 'SupersigCreated') {
                      superSigAccount = data[0].toString();
                      console.log(`SuperSigCreated with account ${superSigAccount}`);
                  }
              });
          } else if (status.isFinalized) {
            setStatus(prev => ({ ...prev, supersigCreated: true }));
            setOutput(prev => ({ ...prev, supersigCreated: `A supersig was created: ${superSigAccount}`}))
              console.log(`Finalized at blockHash ${status.asFinalized}`);
              // Call sendBalance as soon as supersig is created
              if (superSigAccount) {
                sendBalance(api, superSigAccount);
              }
          }
        }).catch((error: any) => {
          const errorAsError = error as Error;
          setStatus(prev => ({ ...prev, supersigCreated: false }));
          setOutput(prev => ({ ...prev, supersigCreated: `A supersig was created: ${superSigAccount}` + errorAsError.message}))
          console.error('Error creating SuperSig:', error);
    
        });
    };
    
      
    const submitAndFinalize = async (tx: any, sender: any): Promise<string> => {
    
      return new Promise((resolve, reject) => {
        tx.signAndSend(sender, ({ events = [], status }) => {
          if (status.isInBlock) {
            console.log('Included at block hash', status.asInBlock.toHex());
            setOutput(prev => ({ ...prev, transaction: 'Transaction included at block hash ' + status.asInBlock.toHex() }));
          } else if (status.isFinalized) {
            console.log('Finalized block hash', status.asFinalized.toHex());
            setOutput(prev => ({ ...prev, transaction: 'Transaction finalized at block hash ' + status.asFinalized.toHex() }));
            resolve(status.asFinalized.toHex() as string);
          }
        }).catch((error: any) => {
          reject(error);
        });
      });
    }
    
      const sendBalance = async (api: ApiPromise, superSigAccount: string): Promise<void> => {
        setOutput(prev => ({ ...prev, balanceSent: `About to send balance of ${amount}`}))

          const keyring = new Keyring({ type: 'sr25519' });
          const alice = keyring.addFromUri('//Alice');
          const amount = 111000000000000;
          // const supersigAccuntId = new keyring.
      
          try {
              setProcessMessage(`Funding the supersig ${superSigAccount} with 100000 units`);

              // execute the transaction
              const txHash = await submitAndFinalize(api.tx.balances.transfer(superSigAccount, amount), alice);

              console.log('Transfer hash:', txHash);
              setStatus(prev => ({ ...prev, balanceSent: true }));
              setOutput(prev => ({ ...prev, balanceSent: `The supersig was funded by Alice: ${superSigAccount} with ${amount}`}))

          
              await createProposal(api, superSigAccount);

          } catch (error) {
            const errorAsError = error as Error;
            setStatus(prev => ({ ...prev, balanceSent: false }));
            setOutput(prev => ({ ...prev, balanceSent: `Supersig account was not funded successfully (try again or debug)` + errorAsError.message}))
              console.error('Error sending balance:', error);
          } 
      };
    
      const createProposal = async (api: ApiPromise, superSigAccount: string) => {
        setOutput(prev => ({ ...prev, balance: `Creating a proposal to send funds from the supersig to Dave.`}))
        try {
            setProcessMessage('Alice proposes to send funds from the supersig to Dave');
            setCurrentStep("create supersig proposal");

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
            const dave = keyring.addFromUri('//Dave');
            const sendBalance = 111000000000000;
                
            // Create an AccountId instance for Dave's address
            const daveAccountId = api.createType('AccountId', dave.address);
            console.log(`this is the supersig about to be proposed ${superSigAccount}`);

            const unsub = await api.tx.supersig.submitCall(superSigAccount, api.tx.balances.transfer(daveAccountId, sendBalance))
              .signAndSend(alice, ({ status, events }) => {

                    if (status.isInBlock) {
                        console.log(`here we are in blocksville...}`);
                        setOutput(prev => ({ ...prev, proposalCreated: `The proposal is now in the block...`}))

                        console.log(`Transaction included at blockHash ${status.asInBlock}`);
                        console.log('Included events:', events);
                        setProcessMessage('Proposal is now in the block...');

                    } else if (status.isFinalized) {
                        console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                        console.log('Finalized events:', events);
                        events.forEach(({ event: { data, method, section }, phase }) => {
                            if (section === 'supersig' && method === 'CallSubmitted') {
                                console.log('Event data:', data.toJSON()); // Log the entire event data
                                const callId = data[0].toHuman(); // Assuming the callId is the first argument of the event
                                console.log(`CallId from CallSubmitted event: ${callId}`);
                                setStatus(prev => ({ ...prev, proposalCreated: true }));
                                setProcessMessage('Proposal created. Waiting for next operation...');
                                setOutput(prev => ({ ...prev, proposalCreated: 'Created proposal with ID ' + callId }));
                                unsub(); // Unsubscribe from the transaction updates

                                approveCall(api, superSigAccount);
                            }
                        });
                    }
                });
        } catch (error) {
          const errorAsError = error as Error;
          setStatus(prev => ({ ...prev, proposalCreated: false }));
          setOutput(prev => ({ ...prev, proposalCreated: `Proposal was not successfully created)` + errorAsError.message}))
          
            console.error('Error submitting call:', error);
        }
      }
    
    
      const proposeDeleteSupersig = async (api: ApiPromise, superSigAccount: string) => {
        try {
          setCurrentStep("create supersig proposal");
          setProcessMessage('Alice is making a proposal to delete the supersig...');
          setOutput(prev => ({ ...prev, supersigDeletionProposed: 'Now we are proposing to delete the supersig because we like to keep our room tidy.' }));

          const keyring = new Keyring({ type: 'sr25519' });
          const alice = keyring.addFromUri('//Alice');
          const aliceAccountId = api.createType('AccountId', alice.address);

          const unsub = await api.tx.supersig.submitCall(superSigAccount, api.tx.supersig.deleteSupersig(aliceAccountId))
          .signAndSend(alice, ({ status, events }) => {
              if (status.isInBlock) {
                setOutput(prev => ({ ...prev, supersigDeletionProposed: `The proposal is now in the block...`}))
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
              } else if (status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                events.forEach(({ event: { data, method, section }, phase }) => {
                  if (section === 'supersig' && method === 'CallSubmitted') {
                    console.log('Event data:', data.toJSON()); // Log the entire event data
                    const callId = data[0].toHuman(); // Assuming the callId is the first argument of the event
                    console.log(`CallId from CallSubmitted event: ${callId}`);
                    setProcessMessage('Proposal created. Waiting for next operation...');
                    setStatus(prev => ({ ...prev, supersigDeletionProposed: true }));
                    setOutput(prev => ({ ...prev, supersigDeletionProposed: 'Created proposal with ID ' + callId }));
                    unsub(); // Unsubscribe from the transaction updates
                    approveDeleteSupersig(api, superSigAccount);
                  }
                });
              }
            });
        } catch (error) {
          const errorAsError = error as Error;
          setStatus(prev => ({ ...prev, supersigDeletionProposed: false }));
          setOutput(prev => ({ ...prev, supersigDeletionProposed: `Proposal was not successfully created)` + errorAsError.message}))
          console.error('Error submitting call:', error);
        }
      }

      const approveCall = async (api: ApiPromise, superSigAccount: string) => {
        setProcessMessage('Alice is about to approvs the proposal.');
        setCurrentStep("create supersig proposal");
        setOutput(prev => ({ ...prev, voteSubmitted: `Approving proposal...`}))
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
            proposeDeleteSupersig(api, superSigAccount)

        } catch (error) {
          const errorAsError = error as Error;
          setStatus(prev => ({ ...prev, voteSubmitted: false }));
          setOutput(prev => ({ ...prev, voteSubmitted: `There was an issue approving the proposal...` + errorAsError.message}))
          console.error('Error approving call:', error);
        }
      }

      const approveDeleteSupersig = async (api: ApiPromise, superSigAccount: string) => {
        try {
            setProcessMessage('Abuot to approve the propose to delete the supersig...');
            setOutput(prev => ({ ...prev, voteDeleteSubmitted: 'About to approve the deletion.' + callId }));

            setCurrentStep("approving supersig proposal");

            const keyring = new Keyring({ type: 'sr25519' });
            const alice = keyring.addFromUri('//Alice');
    
            setProcessMessage('Alice votes to approve the proposal to delete the supersig...');
            const txHash = await submitAndFinalize(api.tx.supersig.approveCall(superSigAccount, callId), alice);

            console.log('Approve call hash:', txHash);
            setStatus(prev => ({ ...prev, voteDeleteSubmitted: true }));
            setProcessMessage('Proposal Approved. Testing Complete.');
            setOutput(prev => ({ ...prev, voteDeleteSubmitted: 'Approved call with ID ' + callId }));
        } catch (error) {
          console.error('Error approving call:', error);
        }
      }

    try {
        const chainWorking = await checkChain(api);
        const palletExists = await checkPallet(api);
        await checkRpcMethods(api, chainWorking, palletExists);
    } catch (error) {
        console.error('An error occurred:', error);
        setStatus(prev => ({ ...prev, errorMessage: 'An error occurred: ' + error.message }));
        setOutput(prev => ({ ...prev, errorMessage: 'An error occurred: ' + error.message }));
    }
  }

  return (
    <div>
      <h1>Supersig Workflow Tester</h1>
      <p>
      Quickly test endpoints to run a e2e workflow test which makes sure all the parts of the supersig user journey work as expected. Open the console to see the output of the tests.
      </p>
      {/* <label>
        Endpoint:
        <input type="text" style={{margin: "5px" ,padding:"5px", border: "sollid 1px gray", borderRadius: "4px", minWidth: "160px" }}value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </label> */}
     
      <button onClick={handleClick} style={{margin: "5px", backgroundColor: "#000", color: "#FFFFFF", border: "none", padding: "8px 15px 8px 15px", borderRadius: "4px", cursor: "pointer"}}>
      Test Supersig
      </button>
     
      <h5> Current Status:</h5> 
      <h3>{processMessage}</h3>
      {/* Display the status of each step */}
      {Object.entries(status).map(([key, value]) => (
            <div key={key}>
                {error[key as keyof typeof error] ? '🔴' :
                value ? '🟢' : '⚪️'} {key.charAt(0).toUpperCase() + key.slice(1)}
                <p style={{fontStyle: "italic"}}>{output[key as keyof typeof output]}</p>
            </div>
    ))}

    </div>
  );

}

export default Settings;
