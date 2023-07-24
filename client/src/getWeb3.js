getWeb3.js

import Web3 from "web3";

const getWeb3 = async () => {
  // Vérifier si Web3 est déjà injecté par le navigateur
  if (window.ethereum) {
    // Utiliser le fournisseur Web3 fourni par MetaMask
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    return web3;
  }
  // Vérifier si Web3 est déjà présent dans le navigateur (anciennes versions de MetaMask)
  else if (window.web3) {
    // Utiliser le fournisseur Web3 injecté
    return new Web3(window.web3.currentProvider);
  }
  // Aucun fournisseur Web3 détecté
  else {
    throw new Error("No Web3 provider detected");
  }
};

export default getWeb3;