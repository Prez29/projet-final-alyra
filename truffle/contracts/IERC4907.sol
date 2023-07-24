// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface IERC4907 {

    // Enregistré lorsque l'utilisateur d'un NFT est modifié ou que la date d'expiration est modifiée
    /// @notice Émis lorsque l'utilisateur (`user`) d'un NFT ou que la date d'expiration (`expires`) de l'utilisateur est modifiée
    /// L'adresse zéro pour `user` indique qu'il n'y a pas d'adresse d'utilisateur
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

    /// @notice Définir l'utilisateur et la date d'expiration d'un NFT
    /// @dev L'adresse zéro indique qu'il n'y a pas d'utilisateur
    /// Lance une exception si `tokenId` n'est pas un NFT valide
    /// @param user Le nouvel utilisateur du NFT
    /// @param expires Horodatage UNIX, l'utilisateur peut utiliser le NFT avant cette date d'expiration
    function setUser(uint256 tokenId, address user, uint64 expires) external;

    /// @notice Obtenir l'adresse de l'utilisateur d'un NFT
    /// @dev L'adresse zéro indique qu'il n'y a pas d'utilisateur ou que l'utilisateur a expiré
    /// @param tokenId Le NFT pour lequel on souhaite obtenir l'adresse de l'utilisateur
    /// @return L'adresse de l'utilisateur pour ce NFT
    function userOf(uint256 tokenId) external view returns(address);

    /// @notice Obtenir la date d'expiration de l'utilisateur d'un NFT
    /// @dev La valeur zéro indique qu'il n'y a pas d'utilisateur
    /// @param tokenId Le NFT pour lequel on souhaite obtenir la date d'expiration de l'utilisateur
    /// @return La date d'expiration de l'utilisateur pour ce NFT
    function userExpires(uint256 tokenId) external view returns(uint256);
}