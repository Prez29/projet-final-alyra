import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import '../App.css';

const MarketplacePrimaire = ({ contract }) => {
  const [availableRentals, setAvailableRentals] = useState([]);
  const [rentalPrices, setRentalPrices] = useState([]);
  

  useEffect(() => {
    const fetchAvailableRentals = async () => {
      try {
        const availableRentals = await contract.methods.searchRentals().call();
        setAvailableRentals(availableRentals);
        console.log("Available rentals:", availableRentals);
      } catch (error) {
        console.error("Error fetching available rentals:", error);
      }
    };

    fetchAvailableRentals();
  }, []);

  useEffect(() => {
    const fetchRentalPrices = async () => {
      try {
        const prices = await contract.methods.getPricePerNightForRentals().call();
        setRentalPrices(prices);
        console.log("Prices per night:", prices);
      } catch (error) {
        console.error("Error fetching rental prices:", error);
      }
    };

    fetchRentalPrices();
  }, []);

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-title">Marketplace Primaire</h2>
      {availableRentals.length > 0 ? (
        availableRentals.map((rentalId, index) => (
          <div key={rentalId} className="listing-card">
            <h3 className="listing-title">Logement: {rentalId}</h3>
            <p className="listing-price">Prix par nuit: {Web3.utils.fromWei(rentalPrices[index].toString(), 'ether')} ETH</p>
            <Link to={"/LouerLogement"} className="LouerLogement-">
              Louer
            </Link>
          </div>
        ))
      ) : (
        <p className="none">Aucune location disponible pour le moment.</p>
      )}
    </div>
  );
};

export default MarketplacePrimaire;