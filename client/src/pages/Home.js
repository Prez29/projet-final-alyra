import React from "react";
import "../Home.css";

const Home = () => {
  return (
    <div className="accueil-container">
      <h1>Bienvenue sur Checkin</h1>
      <p>
        Checkin est une DApp qui permet aux utilisateurs de créer des NFT (tokens non fongibles) associés à des maisons à louer.
        Les utilisateurs peuvent créer des NFT pour leurs maisons et définir un prix de location par nuit.
        Les NFT peuvent ensuite être loués par d'autres utilisateurs pour des périodes spécifiques.
      </p>
      <h2>Comment ça marche ?</h2>
      <ol>
        <li>
          <p>
            Pour commencer, créez un nouveau NFT en indiquant le prix de location par nuit pour votre maison.
          </p>
        </li>
        <li>
          <p>
            Une fois le NFT créé, il sera répertorié comme disponible à la location.
            Les autres utilisateurs pourront rechercher les maisons disponibles à la location et les louer en payant le prix fixé par le propriétaire.
          </p>
        </li>
        <li>
          <p>
            Lorsqu'un NFT est loué, il devient indisponible jusqu'à la fin de la période de location définie par le locataire.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default Home;
