import React, { useState, useEffect } from "react";
import "../App.css";

const LouerLogement = ({ web3, accounts, contract }) => {
  const [tokenId, setTokenId] = useState("");
  const [endDateTimestamp, setEndDateTimestamp] = useState("");
  const [rentalPrices, setRentalPrices] = useState([]);
  const [userAccount, setUserAccount] = useState(accounts[0]);
  const [availableRentals, setAvailableRentals] = useState([]);
  const [rentalId, setRentalId] = useState("");

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

  const handleRentProperty = async (event) => {
    event.preventDefault();
    try {
      // Convertir la date de fin sélectionnée en timestamp (en secondes)
      const formattedEndDate = parseInt(endDateTimestamp, 10);

      // Vérifier que la date de fin est supérieure à la date actuelle (block.timestamp)
      if (formattedEndDate <= Math.floor(Date.now() / 1000)) {
        console.error("Invalid end date");
        return;
      }

      // Vérifier que l'adresse de compte est bien renseignée
      if (!userAccount || !web3.utils.isAddress(userAccount)) {
        console.error("Invalid user address");
        return;
      }

      // Vérifier que rentalPrices n'est pas vide
      if (rentalPrices.length === 0) {
        console.error("Rental prices are not available");
        return;
      }

      // Utilisez directement la variable rentalPrices pour obtenir le prix par nuit
      const pricePerNightEth = web3.utils.fromWei(rentalPrices[0], "ether"); // Nous supposons que rentalPrices est un tableau avec un seul élément.

      // Calculer le montant total à payer en fonction du prix par nuit et de la durée de location en jours
      const durationInSeconds = formattedEndDate - Math.floor(Date.now() / 1000);
      const durationInDays = Math.ceil(durationInSeconds / 86400); // Arrondir au jour supérieur
      const totalPriceEth = (pricePerNightEth * durationInDays).toString();
      console.log("Duration in days:", durationInDays);
      console.log("Total price:", totalPriceEth);

      // Convertir le prix total de la location en Wei avant d'envoyer la transaction
      const totalPriceWei = web3.utils.toWei(totalPriceEth.toString(), "ether");
      console.log("Total price in Wei:", totalPriceWei);

      // Appeler la fonction de contrat pour louer un logement en utilisant le prix total en Wei
      await contract.methods
        .rent(parseInt(tokenId, 10), formattedEndDate)
        .send({ from: userAccount, value: totalPriceWei });
      console.log("Rental successful");


      // Réinitialiser les champs du formulaire
      setTokenId("");
      setEndDateTimestamp("");
    } catch (error) {
      console.error("Error renting property:", error);
    }
  };

      // Fonction pour enlever un logement du Marketplace
      const handleRemoveRental = async (rentalId) => {
        try {
          // Appeler la fonction "removeAvailability" du contrat avec l'ID du logement à retirer
          await contract.methods.removeAvailability(rentalId).send({ from: userAccount });
          // Mettre à jour la liste des logements disponibles après avoir retiré le logement
          setAvailableRentals((prevRentals) => prevRentals.filter((id) => id !== rentalId));
        } catch (error) {
          console.error("Error removing rental from marketplace:", error);
        }
      };
      

  return (
    <div className="louerLogement">
      <h2>Louer un logement</h2>
      <form onSubmit={handleRentProperty}>
        <label>
          ID du logement (Token ID) :
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Date de fin de location (timestamp) :
          <input
            type="text"
            value={endDateTimestamp}
            onChange={(e) => setEndDateTimestamp(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Votre adresse de compte :
          <input
            type="text"
            value={userAccount}
            onChange={(e) => setUserAccount(e.target.value)}
            required
          />
        </label>
        <button onClick={() => handleRemoveRental(rentalId)}>Louer</button>
      </form>
    </div>
  );
};

export default LouerLogement;
