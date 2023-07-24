https://www.loom.com/share/890b968467b34066ba767c0ade9c665b

# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Webpack](https://webpack.js.org). Either one would be a great place to start!


Outils utilisés :

Truffle v5.9.2

Ganache v7.8.0

Solidity v0.5.16

Node v16.16.0

Web3.js v1.10.0

Truffle Box React (All in One) => Installation : truffle unbox react

Vercel (https://vercel.com/) : pour la publication de la Dapp via Github

Loom (https://www.loom.com/) pour les vidéos de démo

Blockhain network de test : SEPOLIA

Choix des technologies :
Nous avons choisi la Truffle Box React car :

c'est l'outil qui est abordé dans les cours en ligne
le plus simple à utiliser pour nous
nous n'avons pas eu le temps à nous consacrer à utiliser Hardhat

Checkin 

Overview
Checkin is a decentralized application (DApp) that allows users to create and manage non-fungible tokens (NFTs) associated with rental homes. Users can create NFTs for their homes and set a price per night for renting them out. Other users can then search for available rental homes and rent them by paying the specified price.

Functionality
The Checkin smart contract includes the following functionality:

Creating NFTs: Users can create NFTs associated with their rental homes by calling the createNFT function and specifying the price per night for renting the home.

Getting Rental Details: Users can get details of a rental by calling the getRental function with the token ID of the NFT. This function returns the address of the owner, the end date of the current rental period, the price per night, and the token ID.

Listing Available Rentals: Users can get the prices per night for all available rentals by calling the getPricePerNightForRentals function.

Renting a Home: Users can rent a home by calling the rent function with the token ID of the NFT and the end date of the rental period. The user must send the required payment to cover the rental period.

Relisting a Rental: Owners of rental homes can relist their NFTs for rent by calling the relistRental function and specifying the new price per night.

Contract Inheritance
The Checkin smart contract inherits functionalities from the ERC4907 standard and several OpenZeppelin contracts:

ERC4907: The contract implements the ERC4907 standard, which allows for the creation and management of NFTs with specific metadata and attributes.

ERC721: The contract inherits from the ERC721 standard, which is the standard for non-fungible tokens on the Ethereum blockchain.

ERC721Enumerable: The contract also inherits from the ERC721Enumerable extension, which adds enumeration capabilities to the ERC721 standard.

Ownable: The contract uses the Ownable contract from the OpenZeppelin library to manage ownership and access control.

Use
To interact with the Checkin smart contract, users can use web3.js or similar libraries to send transactions and call functions. The contract requires the use of the Ethereum blockchain and accounts with sufficient ether to cover the rental costs.

Disclaimer
This smart contract is provided for educational and illustrative purposes only. It has not undergone a security audit and should not be used in a production environment without proper auditing and security reviews. The authors and maintainers of this smart contract are not responsible for any loss of funds or damages resulting from the use of this contract.

Author
This decentralized application was created by Lucu Charly.
