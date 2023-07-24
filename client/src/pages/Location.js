import React, { useEffect, useState } from "react";
//import { Route } from "react-router-dom";
import '../App.css';

const Location = ({ match, contract, accounts }) => {
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const { id } = match.params;
    const fetchListingDetails = async () => {
      try {
        // Appeler une méthode du contrat pour récupérer les détails du logement spécifique
        const listingDetails = await contract.methods.getHousingDetails(id).call();
        setListing(listingDetails);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };

    fetchListingDetails();
  }, [match.params]);

  const handleRent = async () => {
    try {
      // Effectuer l'action de location du logement en utilisant le contrat
      await contract.methods.rentHousing(listing.id).send({ from: accounts[0] });

      // Afficher une confirmation ou effectuer d'autres actions nécessaires
      alert("Le logement a été loué avec succès !");
      console.log("Le logement a été loué avec succès !");
    } catch (error) {
      alert("Erreur lors de la location du logement");
      console.error("Error renting housing:", error);
    }
  };

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="location-container">
      <h2 className="location-title">Détails de location</h2>
      <h3 className="listing-title">{listing.title}</h3>
      <p className="listing-description">Decsrciption:{listing.description}</p>
      <p className="listing-price">Prix : {listing.price}</p>
      <p className="listing-proprietaire">Propriétaire : {listing.owner}</p>
      <button onClick={handleRent}>Louer</button>
    </div>
  );
};

export default Location;