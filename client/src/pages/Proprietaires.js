import React, {/*useEffect*/ useState } from "react";
import "../App.css";

const Proprietaires = ({ web3, accounts, contract }) => {
  const [price, setPrice] = useState(0);

  const handlePropriétaires = async (event) => {
    event.preventDefault();
    try {
      // Convertir le prix en Wei (la plus petite unité d'Ether)
      const priceWei = web3.utils.toWei(price.toString(), "ether");

      // Appeler la fonction de contrat pour enregistrer un logement
      await contract.methods
        .createNFT(priceWei)
        .send({ from: accounts[0] });

      // Réinitialiser les champs du formulaire
      setPrice("");
    } catch (error) {
      console.error("Error enregistrement logement:", error);
    }
  };

  return (

    <div className="Propriétaires">
      <h2>Enregistrer un logement</h2>
      <form onSubmit={handlePropriétaires}>
        <label>
        Prix par nuit (ETH) :
          <input
            type= "number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>
        <input type="submit" value="Enregistrer" />
      </form>
    </div>

  );
};

export default Proprietaires;