const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { Context } = require('mocha');

const Checkin = artifacts.require('Checkin');

contract('Checkin', (accounts) => {
  const owner = accounts[0];
  const renter = accounts[1];
  const renter2 = accounts[2];
  const pricePerNight = new BN(1);
  const newPricePerNight = new BN(2);
  const tokenId = new BN(1);
  const tokenId2 = new BN(2);
  const endDate = new BN (Math.floor(Date.now() / 1000) + 86400 * 2);
  const endDate2 = new BN (Math.floor(Date.now() / 1000) + 86400 * 14);



  let CheckinInstance;

  beforeEach(async function () {
    CheckinInstance = await Checkin.new({ from: owner });
  });

  describe("Checkin.sol contract", function () {

    describe("Contract Test", function () {
      it("Should deploy Checkin", async function () {
        expect(CheckinInstance.address).to.not.equal("");
      });
    });

        describe("createNFT", function () {
          it("Should add a new logement", async function () {
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
    
            const logement = await CheckinInstance.getRental(1);
            expect(logement[0]).to.equal(owner); 
            expect(logement[1].toString()).to.equal("0"); 
            expect(logement[2].toString()).to.equal(pricePerNight.toString()); 
            expect(logement[3].toString()).to.equal("1");
          });
    
          it("Should set the correct owner for the new NFT", async function () {
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
            const ownerOfNFT = await CheckinInstance.ownerOf(1);
    
            expect(ownerOfNFT).to.equal(owner);
          });
    
          it("Should emit TokenMinted event with the correct values", async function () {
            const receipt = await CheckinInstance.createNFT(pricePerNight, { from: owner });
    
            expectEvent(receipt, 'TokenMinted', {
              tokenId: new BN(1),
              proprietaire: owner,
              pricePerNight: pricePerNight,
            });
          });
        });

        describe("getRental", function () {

          it("Should return the correct logement details", async function () {
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
    
            const logement = await CheckinInstance.getRental(1);
            expect(logement[0]).to.equal(owner); 
            expect(logement[1].toString()).to.equal("0");
            expect(logement[2].toString()).to.equal(pricePerNight.toString()); 
            expect(logement[3].toString()).to.equal("1"); 
          });

          it("Should return the rental details for an existing tokenId", async function () {
            const tokenId = 1;
            const pricePerNight = new BN(10);
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
        
            const rentalDetails = await CheckinInstance.getRental(tokenId);
        
            expect(rentalDetails[0]).to.equal(owner); 
            expect(rentalDetails[1].toString()).to.equal("0"); 
            expect(rentalDetails[2].toString()).to.equal(pricePerNight.toString());
            expect(rentalDetails[3].toString()).to.equal(tokenId.toString()); 
          });
        });

        describe("getPricePerNightForRental", function () {

          it("should return prices per night for all available rentals", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
            await CheckinInstance.createNFT(200, { from: accounts[1] });
            await CheckinInstance.createNFT(150, { from: accounts[2] });
        
            const prices = await CheckinInstance.getPricePerNightForRentals();
        
            expect(prices.length).to.equal(3);
            expect(prices[0]).to.equal("100");
            expect(prices[1]).to.equal("200");
            expect(prices[2]).to.equal("150");
          });
        
          it("should return an empty array if no rentals are available", async () => {
            const prices = await CheckinInstance.getPricePerNightForRentals();
        
            expect(prices.length).to.equal(0);
          });
        });

        describe("getRentalAvailability", function () {

          it("should return true for rental availability", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
        
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[0]);
        
            const rentalAvailability = await CheckinInstance.getRentalAvailability(tokenId);
            assert.isTrue(rentalAvailability, "Rental should be available");
          });
        
          it("should return false for rental availability after renting", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
          
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[0]);
          
            await CheckinInstance.rent(tokenId, Math.floor(Date.now() / 1000) + 604800, { from: accounts[1], value: 700 }); // 7 nights * 100 wei
          
            const rentalAvailability = await CheckinInstance.getRentalAvailability(tokenId);
            assert.isFalse(rentalAvailability, "Rental should be unavailable after being rented");
          });
          
          it("should not be able to rent an unavailable home", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
          
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[0]);
          
            await CheckinInstance.rent(tokenId, Math.floor(Date.now() / 1000) + 604800, { from: accounts[1], value: 700 }); // 7 nights * 100 wei
          
            try {
              await CheckinInstance.rent(tokenId, Math.floor(Date.now() / 1000) + 1209600, { from: accounts[1], value: 100 }); // 1 night * 100 wei
              assert.fail("Should not be able to rent an unavailable home");
            } catch (error) {
              assert.include(error.message, "revert", "Expected revert");
            }
          });
        });

        describe("getLogementTokenId", function () {

          it("should return the correct token ID for the user's rental home", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[0]);
          
            assert.equal(tokenId, 1, "Incorrect token ID for the user's rental home");
          });
          
          it("should return 0 for a user with no rental home", async () => {
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[1]);
          
            assert.equal(tokenId, 0, "Token ID should be 0 for a user with no rental home");
          });

          it("should return the correct token ID after a user rents a home", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
            const tokenIdBeforeRent = await CheckinInstance.getLogementTokenId(accounts[0]);
          
            assert.notEqual(tokenIdBeforeRent, 0, "User should own a rental home before renting");
          
            await CheckinInstance.rent(1, Math.floor(Date.now() / 1000) + 86400, { from: accounts[1], value: 100 });
          
            const tokenIdAfterRent = await CheckinInstance.getLogementTokenId(accounts[1]);
            assert.equal(tokenIdAfterRent, 0, "Incorrect token ID for the user's rental home");
          });
          
          
          it("should return 0 after a user rents a home and then returns it", async () => {
            await CheckinInstance.createNFT(100, { from: accounts[0] });
            await CheckinInstance.rent(1, Math.floor(Date.now() / 1000) + 86400, { from: accounts[1], value: 100 });
            await CheckinInstance.createNFT(100, { from: accounts[0] });
          
            const tokenId = await CheckinInstance.getLogementTokenId(accounts[1]);
          
            assert.equal(tokenId, 0, "Token ID should be 0 after returning the rental home");
          });          
        });

        describe("searchRentals", function () {
          it("Should return an empty array when no rentals are available", async function () {
            const availableRentals = await CheckinInstance.searchRentals();
        
            expect(availableRentals).to.be.an("array").that.is.empty;
          });

          it("Should return an array with the IDs of available rentals", async function() {
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
            await CheckinInstance.createNFT(pricePerNight, { from: renter });
            const availableRentals = await CheckinInstance.searchRentals();
        
            expect(availableRentals.map(id => id.toString())).to.include("1");
            expect(availableRentals.map(id => id.toString())).to.include("2");
          });

        });  

        describe("rent", function () {

          it("Should revert when the caller is not the owner of the rental", async function () {
            await CheckinInstance.createNFT(pricePerNight, { from: owner });
        
            await expectRevert.unspecified(CheckinInstance.rent(tokenId, 0, { from: renter2 }));
            });

            it("Should revert when the rental is not available", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
          
              const initialPrice = pricePerNight; 
          
              await CheckinInstance.rent(1, endDate, { from: renter, value: pricePerNight });
          
              await expectRevert(
                  CheckinInstance.rent(1, endDate, { from: renter2, value: initialPrice }),
                  "This rental is not available for rent"
              );
          });
          
            it("Should revert when the caller does not send enough Ether", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
        
              const insufficientPayment = pricePerNight.sub(new BN(1));
              await expectRevert(
                CheckinInstance.rent(tokenId, endDate, { from: renter, value: insufficientPayment }),
                "Insufficient payment");
            });

            it("Should set the correct values for the rental", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: new BN(1) });
            
              const rentalDetails = await CheckinInstance.getRental(tokenId);
            
              expect(rentalDetails[0]).to.equal(owner); 
              expect(rentalDetails[1].toString()).to.equal(endDate.toString()); 
              expect(rentalDetails[2].toString()).to.equal(pricePerNight.toString());
              expect(rentalDetails[3].toString()).to.equal(tokenId.toString()); 
            });          

            it("Should emit Rent event with the correct values", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              const receipt = await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
            
              expectEvent(receipt, 'Rent', {
                tokenId: tokenId,
                endDate: endDate,
                renter: renter,

              });
            });

            it("Should transfer the rental to the renter", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
            
              const ownerOfNFT = await CheckinInstance.ownerOf(tokenId);
            
              expect(ownerOfNFT).to.equal(renter);
            });

            it('Should revert when trying to rent with an invalid end date', async () => {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              const invalidEndDate = new BN(Math.floor(Date.now() / 1000) - 86400);
          
              await expectRevert(CheckinInstance.rent(tokenId, invalidEndDate, { from: renter, value: pricePerNight }), 'Invalid end date');
            });
            it('Should update the rental availability after renting', async () => {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
          
              const rentalAvailability = await CheckinInstance.getRentalAvailability(tokenId);
              assert.equal(rentalAvailability, false, 'Rental should be marked as unavailable after renting');
            });
          
            it('Should increase the balance of the owner after renting', async () => {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });

              const initialOwnerBalance = new BN(await web3.eth.getBalance(owner));
              const renterBalanceBeforeRenting = new BN(await web3.eth.getBalance(renter));
            
              const { receipt } = await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
            
              const gasUsed = new BN(receipt.gasUsed);
              const tx = await web3.eth.getTransaction(receipt.transactionHash);
              const gasPrice = new BN(tx.gasPrice);
              const gasCost = gasUsed.mul(gasPrice);
            
              const ownerRevenue = pricePerNight.sub(gasCost);
              const expectedOwnerBalance = initialOwnerBalance.add(ownerRevenue);
              const expectedRenterBalance = renterBalanceBeforeRenting.sub(pricePerNight);
            
              const finalOwnerBalance = new BN(await web3.eth.getBalance(owner));
              const finalRenterBalance = new BN(await web3.eth.getBalance(renter));
            
              expect(finalOwnerBalance).to.be.a.bignumber.that.is.at.least(expectedOwnerBalance, 'Owner balance is incorrect after renting');
              expect(finalRenterBalance).to.be.a.bignumber.that.is.at.most(expectedRenterBalance, 'Renter balance is incorrect after renting');
            });
          
            it('Should not allow renting the same home by the same renter before the previous rental ends', async () => {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
          
              const newEndDate = new BN(Math.floor(Date.now() / 1000) + 86400 * 2); // Set the new end date to be 2 days from now
              await expectRevert(CheckinInstance.rent(tokenId, newEndDate, { from: renter, value: pricePerNight }), 'This rental is not available for rent');
            });
        });

         /* describe("relistRental", function () {

            it("Should revert when the caller is not the owner of the rental", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
          
              await expectRevert(CheckinInstance.relistRental(tokenId, pricePerNight, { from: renter2 }),"You are not the owner");
            });

            it("Should revert when renters try to relist a rental that is already available", async function () {
              await CheckinInstance.createNFT(pricePerNight, { from: owner });
              await CheckinInstance.rent(tokenId, endDate, { from: renter, value: pricePerNight });
            
              await expectRevert(
                CheckinInstance.relistRental(tokenId, newPricePerNight, { from: renter }),
                "Token is already available for rent"
              );
            });
          });*/
      });
});
    