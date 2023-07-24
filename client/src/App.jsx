import React, { useEffect, useState } from "react";
import Web3 from "web3";
import CheckinContract from "./contracts/Checkin.json";
//import EthProvider from "EthProvider";
//import getWeb3 from "./getWeb3";
import Header from "./pages/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Proprietaires from "./pages/Proprietaires";
import MarketplacePrimaire from "./pages/MarketplacePrimaire";
import Location from "./pages/Location";
import LouerLogement from "./pages/LouerLogement";
import MyRents from "./pages/MyRents";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);


  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        const web3Instance = new Web3(window.ethereum || "http://localhost:8545");
        setWeb3(web3Instance);
  
        const aAccounts = await web3Instance.eth.getAccounts();
        setAccounts(aAccounts);
  
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = CheckinContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          CheckinContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };
  
    initializeWeb3();
  }, []);

  if (!web3 || !accounts || !contract) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
        <Route index element={<Home />} />
          <Route
            path="/Home"
            element={<Home />}
          />
          <Route
            path="/Proprietaires"
            element={<Proprietaires contract={contract} accounts={accounts} web3={web3} />}
          />
          <Route
            path="/MarketplacePrimaire"
            element={<MarketplacePrimaire contract={contract} />}
          />
          <Route 
            path="/Location"
            element={<Location contract={contract} accounts={accounts}/>}
            />
          <Route
            path="/LouerLogement"
            element={<LouerLogement contract={contract} accounts={accounts} web3={web3} />}
          />
          <Route
            path="/MyRents"
            element={<MyRents contract={contract} accounts={accounts} />}
          />
        </Routes>
      </Router>
    </div>
  );
}
export default App;