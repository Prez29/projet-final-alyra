import React, { useEffect, useState } from "react";
import "../App.css";

const MyRents = ({ web3, accounts, contract }) => {
  const [userRentals, setUserRentals] = useState([]);

  useEffect(() => {
    const fetchUserRentals = async () => {
      try {
        // Récupérer l'ID du logement possédé par l'utilisateur à partir du smart contract
        const tokenId = await contract.methods.getLogementTokenId(accounts[0]).call();
        if (tokenId !== "0") {
          // Si l'utilisateur possède un logement, récupérer ses informations
          const rental = await contract.methods.getRental(tokenId).call();
          setUserRentals([rental]);
        } else {
          setUserRentals([]); // Si l'utilisateur ne possède aucun logement, vider le tableau
        }
      } catch (error) {
        console.error("Error fetching user rentals:", error);
      }
    };
  
    fetchUserRentals();
  }, [accounts, contract]);
  

  return (
    <div className="mesLocations">
      <h2 className="location-title">Mes Locations</h2>
      {userRentals.length > 0 ? (
      userRentals.map((rental) => (
        <div key={rental[3]} className="location-card">
          <h3 className="listing-title">Logement: {rental[3]}</h3>
          {web3 && (
            <p className="listing-price">Prix par nuit: {web3.utils.fromWei(rental[2].toString(), "ether")} ETH</p>
          )}
          <p className="listing-end-date">Date de fin de location: {rental[1]}</p>
        </div>
      ))
    ) : (
      <p className="none">Aucun logement en location</p>
    )}

        </div>
      );
    };

export default MyRents;
