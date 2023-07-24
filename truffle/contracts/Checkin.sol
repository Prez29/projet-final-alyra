// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/utils/Counters.sol"; 
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; 
import "@openzeppelin/contracts/utils/Counters.sol"; 
import "./IERC4907.sol"; 
import "./ERC4907.sol";

/**
*@title Checkin.symbol
*
*@author Lucu Charly
*
*@dev Checkin.description Checkin is a DApp that allows these users to create NFTs associated with a home to rent it out.
 */
contract Checkin is ERC4907 {

/**
*
 */
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; 

    struct Rental {
        address proprietaire;
        uint256 endDate;
        uint256 pricePerNight;
        bool isAvailable;
    }

    mapping(uint256 => Rental) private rentals;
    mapping(address => uint256) private logementToNFT;
    mapping(uint256 => bool) private rentalAvailability;
    uint256[] isAvailable;

    event TokenMinted(uint256 tokenId, address proprietaire, uint256 pricePerNight);
    event Rent(uint256 tokenId, address renter, uint256 endDate);
    event RentalRelisted(uint256 tokenId, uint256 pricePerNight);

    constructor() ERC4907("CheckIn", "CI") {}

    /**
     * @dev Create a new NFT associated with a rental home.
     * @param pricePerNight The price per night to rent the home.
     */
    function createNFT(uint256 pricePerNight) external {
        address proprietaire = msg.sender;
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(proprietaire, newTokenId);

        rentals[newTokenId] = Rental({
            proprietaire: proprietaire,
            endDate: 0,
            pricePerNight: pricePerNight,
            isAvailable: true
        });

        rentalAvailability[newTokenId] = true;
        logementToNFT[proprietaire] = newTokenId;

        isAvailable.push(newTokenId);

        emit TokenMinted(newTokenId, proprietaire, pricePerNight);
    }

    /**
     * @dev Get the details of a rental.
     * @param tokenId The ID of the rental NFT.
     * @return proprietaire The address of the owner of the rental home.
     * @return endDate The end date of the current rental period.
     * @return pricePerNight The price per night to rent the home.
     * @return tokenId The ID of the rental NFT.
     */
    function getRental(uint256 tokenId) public view returns (address, uint256, uint256, uint256) {
        Rental memory rental = rentals[tokenId];
        return (rental.proprietaire, rental.endDate, rental.pricePerNight, tokenId);
    }

    /**
     * @dev Get the prices per night for all available rentals.
     * @return prices An array of strings representing the prices per night.
     */
    function getPricePerNightForRentals() public view returns (string[] memory) {
        string[] memory prices = new string[](isAvailable.length);
        for (uint256 i = 0; i < isAvailable.length; i++) {
            uint256 rentalId = isAvailable[i];
            prices[i] = Strings.toString(rentals[rentalId].pricePerNight);
        }
        return prices;
    }

    /**
     * @dev Get the availability status of a rental.
     * @param tokenId The ID of the rental NFT.
     * @return true if the rental is available, false otherwise.
     */
    function getRentalAvailability(uint256 tokenId) public view returns (bool) {
        return rentals[tokenId].isAvailable;
    }

    /**
     * @dev Get the token ID of the rental associated with a user s home.
     * @param user The address of the user.
     * @return logementToNFT The token ID of the rental associated with the user s home.
     */
    function getLogementTokenId(address user) external view returns (uint256) {
    return logementToNFT[user];
    }

    /**
     * @dev Get the token ID of the rental associated with a user s home.
     * @return availableRentals An array of token IDs representing the available rentals.
     */
    function searchRentals() public view returns (uint256[] memory) {

        // Create an array to store the available rentals
        uint256[] memory availableRentals = new uint256[](_tokenIds.current());

        // Create an array to store the prices per night of the available rentals
        uint256[] memory pricePerNight = new uint256[](_tokenIds.current());
        uint256 count = 0;

        // Parcour all rentals and add the available ones to the array
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (rentalAvailability[i]) {
                availableRentals[count] = i;
                pricePerNight[count] = rentals[i].pricePerNight;
                count++;
            }
        }

        return availableRentals;
    }

    /**
     * @dev Rent a home.
     * @param tokenId The ID of the rental NFT.
     * @param endDate The end date of the rental period.
     */
    function rent(uint256 tokenId, uint256 endDate) external payable {
        require(rentals[tokenId].isAvailable, "This rental is not available for rent");
        require(endDate > block.timestamp, "Invalid end date");

        // calcul the total price
        uint256 duration = endDate - block.timestamp;
        uint256 totalNights = duration / 86400; // Nombre total de nuits
        uint256 totalPrice = rentals[tokenId].pricePerNight * totalNights;

        // Use modulo to calculate the amount due for the remaining nights
        uint256 remainingNights = rentals[tokenId].endDate > block.timestamp ? (rentals[tokenId].endDate - block.timestamp) / 86400 : 0;
        uint256 remainingPrice = rentals[tokenId].pricePerNight * remainingNights;

        // Check that the sent amount is sufficient to cover the rented nights and the remaining nights
        require(msg.value >= totalPrice - remainingPrice, "Insufficient payment");

        // Transfer the received amount to the owner of the home
        address proprietaire = rentals[tokenId].proprietaire;
        (bool success, ) = proprietaire.call{value: msg.value}("");
        require(success, "Failed to send payment to owner");

        // Update the contract state to indicate that the home is rented and unavailable
        rentals[tokenId].endDate = endDate;
        rentals[tokenId].isAvailable = false; 
        removeAvailability(tokenId); 

        // Transfer the NFT to the renter
        _safeTransfer(proprietaire, msg.sender, tokenId, "");

        emit Rent(tokenId, msg.sender, endDate);
    }


    /**
     * @dev Remove a rental from the list of available rentals.
     * @param tokenId The ID of the rental NFT.
     */
    function removeAvailability(uint256 tokenId) internal { 
        for (uint256 i = 0; i < isAvailable.length; i++) {
            if (isAvailable[i] == tokenId) {
                isAvailable[i] = isAvailable[isAvailable.length - 1];
                isAvailable.pop();
                break;
            }
        }
    }
}