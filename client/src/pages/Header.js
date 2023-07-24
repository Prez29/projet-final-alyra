import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import CheckinContract from "../contracts/Checkin.json";
import '../App.css';


const Header = () => {

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          await window.ethereum.enable();

          const accounts = await web3.eth.getAccounts();

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = CheckinContract.networks[networkId];
          const contract = new web3.eth.Contract(
            CheckinContract.abi,
            deployedNetwork && deployedNetwork.address
          );

        } else {
          console.error("Web3 not found in the browser.");
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initializeWeb3();
  }, []);

  return (
    <div className="Header">
      <img className="logo_checkin" src="logo_checkin.PNG" alt="logo" />
      <h1 className="header">
        CheckIN
        <p>The easiest way to enjoy your stay.</p>
      </h1>
      <nav>
        <ul className="navbar">
          <Link to="/Home">Accueil</Link>

          <Link to="/Proprietaires">Propriétaires</Link>

          <Link to="/MarketplacePrimaire"> Marketplace </Link>

          <Link to="/MyRents">Mes Locations</Link>
        </ul>
      </nav>
    </div>
  );
};

export default Header;