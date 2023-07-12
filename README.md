# Supersig UI

Supersig UI is an open source project that creates simple experiences for interacting with organisations using the supersig pallet and rpc module. 

We’ve created a simple open source UI which enables users to manage their supersig(s) easily, along with an Address book, and Accounts to show your balances connected to your Polkadot Extension.

## Setup Supersig UI on local machine

```
git clone https://github.com/decentration/supersig-ui.git
yarn 
yarn start
Now it should be available on port 3000, or if that is busy, a different port will be selected.
```

Et Voila! you can interact with supersig on the provided chain in the chain selector.

If you want you can add a substrate-node-template containing the supersig pallet and rpc module to your local machine:

## Setup Supersig Node Template

```
git clone https://github.com/decentration/substrate-supersig-template
git checkout v0.9.37-fix-unbounded
cargo update
cargo build --release
./target/release/node-template --dev
```

## Test Supersig Workflow
Test the workflow of your chain containing Supersig features.

To swiftly test and debug your chain containing Supersig go to Settings and click Test Supersig.


**Supersig Workflow Tester**
This will run through a workflow of tests, checking:

if the chain is working,
- then if the supersig pallet is in the chain,
- then if the Rpc methods are correctly showing,
- then it will create a supersig org with Alice as a member,
-then it will send a balance to that supersig,
- then it will create a proposal to send some balance to Dave,
- then the member (Alice) will approve the proposal.
- Then Alice will propose to delete the supersig,
- then Alice will approve that, and then the workflow is complete.
- If the test completes you can be sure your chain, the supersig, and its - interaction with the UI will be working sufficiently. If it does not complete you can check the errors and debug your setup until it works.


## Permanently add your own chain to the Chain Selector (optional)
1. Add your chain definitions in `./packages/apps/config/chains/specs/index.ts` add your chain definitions, and then add your chain definitions .ts file.
2. Also add the chain definitions in: `./packages/apps-config/src/api/spec/index`, and add the chain definitions file as well.
3. Add the types to the `./packages/apps-config/src/api/spec/typesBundle.ts` either by runnign yarn build:typesBundle or if you face issues, you can manually insert the types into the typesBundle.ts file.

_Note: make sure that the name you use in the spec matches the name of the chain, else it will not work, and you will not have an error_


## Docker 

Run this container:

```
docker run --rm -it --name supersig-ui -p 3000:3000  decentration/supersig-ui:latest
```

If you want to make local changes then you can run:

```
docker build -t decentration/supersig-ui:latest -f docker/Dockerfile .
```

To push to your docker public library:

```
docker push decentration/supersig-ui:latest  # or replace "decentration" with your own docker username.        
```


To interact with your local node, you can select Development in the Chain Selector, if you are using ws://127.0.0.1:9944, else you can create a Custom port.

A Portal into the Polkadot and Substrate networks. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via https://polkadot.js.org/apps/ or you can access the IPFS hosted version via https://polkadot.js.org/apps/ipfs (via hash) or https://dotapps.io (via ipns) to explore any of the supported Polkadot and Substrate chains.

If you run one or more IPFS node(s), pinning the UI (which only gets updated on releases) will make it faster for you and others. You can find details about that below in the IPFS chapter below.



**Important** If you are a chain developer and would like to add support for your chain to the UI, all the local configuration (API types, settings, logos) can be customized in [the apps-config package](packages/apps-config#README.md), complete with instructions of what goes where.


## Overview

The repo is split into a number of packages, each representing an application.


## Development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/polkadot-js/apps <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >= 16](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >= 1.22](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)


## Docker

You can run a docker container via -

```
docker run --rm -it --name polkadot-ui -e WS_URL=ws://someip:9944 -p 80:80 jacogr/polkadot-js-apps:latest
```

To build a docker container containing local changes -

```
docker build -t jacogr/polkadot-js-apps -f docker/Dockerfile .
```

When using these Docker commands, you can access the UI via http://localhost:80 (or just http://localhost)

## IPFS

IPFS allows sharing files in a decentralized manner in a similar fashion the polkadot network exchanges blocks. IPFS works best when many nodes seed the same data. Nodes can seed specific data by **pinning** them.

You can pin with the following command:

```
curl -s https://polkadot.js.org/apps/ipfs/pin.json | jq -jr .IpfsHash | xargs -0 -I CID ipfs pin add --progress CID
```

Here is a script you can save as `/usr/local/bin/polkadotjs-ipfs-pin.sh`:

```
#!/usr/bin/env bash

IPFS='/usr/local/bin/ipfs'
curl -s https://polkadot.js.org/apps/ipfs/pin.json | jq -jr .IpfsHash | xargs -0 -I CID $IPFS pin add --progress CID
```

I suggest to run the script once. The output should be similar to (the CID/Hash will very likely be different though):
```
$ /usr/local/bin/polkadotjs-ipfs-pin.sh
pinned QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursively
```

Now that you know the CID (hash), you can check whether the data is already pinned or not:
```
$ ipfs pin ls | grep QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursive
```

Now that we know it works, we can automate that with a cron task. Run `crontab -e`.
If you see only comments, append the following to the file and save:
```
SHELL=/bin/bash
HOME=/
0 * * * * /usr/local/bin/polkadotjs-ipfs-pin.sh >/dev/null 2>&1
```

Now our script will run every hours at minute '0' (8:00, 9:00, etc...). To check, we can unpin temporarily:
```
$ ipfs pin rm QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
unpinned QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
```

Now asking for the CID confirms that is it not there.
```
$ ipfs pin ls QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
Error: path 'QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW' is not pinned
```

Wait until the your cron task runs and try again:
```
$ ipfs pin ls QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW
QmNYAbzaE8kRAf68YiN3ZuUxgdwroeav3JhicsHsG5b2oW recursive
```

Tada! This is now automatic and you may forget it.

If you are curious and want to know how many people seed the UI on IPFS, here is the magic command (it may take a while to return the answer as ipfs will search for about 1 minute):
```
ipfs dht findprovs QmTejwB7mJPBHBoqubjzHSgSxfLMcjnZA3LFefqoQc87VJ | wc -l
```

If you are current about the content of what you just pinned, you may use the following command:
```
$ ipfs ls QmTejwB7mJPBHBoqubjzHSgSxfLMcjnZA3LFefqoQc87VJ
QmPJGyqVCcXm238noz7TZDByyGa35qqc8g6sfyXF3KDXZ3 38078   favicon.ico
QmdouVsVE9rMVB84Cy1ehVi1LAGW1fKcqqQxSEjgxJrv7H 668     index.html
QmWHcGf1JCFZCYjZsw52vM5RiJVbcNpX1fo2NyoBKBvtuf -       ipfs/
QmT6NwDsJzMyBs6bMq845nMumeJWbixBfNXA9hdAhAMdSG -       locales/
QmcgiZpwvpT1E1dkSS3zr5je89rZRVocNKPebgWhn3JVTC 2178582 main.ce05dfca.js
QmdnEtuhFDyw5Tjr82bFPzyveFrbkYjJAnUvBvzwT18YGG 337     manifest.json
QmW7gDKHbmtD7sRTqsvyo84bDpyYPZR3w1wQo8pme2q5HC -       next/
Qmd8UnRQiBobm4qb6dhiC1HoQ7SvwZrWJenoN3JPEV3iiF 480594  polkadotjs.3af757ad.js
QmUfXPMfNys8Y8dekuankBx7BHiSAjALCpBDKH6F5DdcNm 628284  react.0cecb00d.css
QmSEgXdQbC1ek9Td1mHy3BRvJpfWHm9zQYegTgAUj1QC4g 924156  react.8f083b49.js
QmfGBgFe2aqf83Wv21m9k5DH2ew89CDj4tydoxJWdK6NNL 1552    runtime.3d77e510.js
QmYPa8jcHH7gfopMALr5XTW4i1QM2xgVBe3NeP11y3tErA -       static/
QmeYBC5EgbccC8NEwXC2rvbd93YiHtTM5xYzqCDohXerDf 859984  vendor.8b793a81.js
```

## Desktop App

The main advantage of using Desktop App is that it by default stores encrypted accounts on the filesystem instead of browser's local storage.
Local storage is susceptible to attacks using XSS (Cross-Site Scripting). There's no such risk when with files stored on disk.

The desktop app uses the [Electron](https://www.electronjs.org/) framework. It provides the same features as web app, the only difference
being different account storage.

The accounts are stored in the following directories:
* Mac: `~/Library/Application Support/polkadot-apps/polkadot-accounts`
* Linux: `~/.config/polkadot-apps/polkadot-accounts` (or `$XDG_CONFIG_HOME/polkadot-apps/polkadot-accounts` if `$XDG_CONFIG_HOME` is defined)
* Windows: `%APPDATA%\polkadot-apps\polkadot-accounts`

For more details on the desktop app, head over to [Electron package README](https://github.com/polkadot-js/apps/blob/master/packages/apps-electron/README.md).
