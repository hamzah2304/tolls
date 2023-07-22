// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


//Currently there is no numeration by squares, so need to impliment that. 

contract Toll is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LAND_OWNER_ROLE = keccak256("LAND_OWNER_ROLE");
    uint256 public constant LAND_PRICE_IN_DOLLARS = 10; // Default price in dollars 


    //Structure context: there are users and areas which are structs. they are then mapped to 
    //create total area and total user pool 

    // Struct to represent land areas and owners
    struct LandArea {
        address owner;
        uint256 price;
        uint256 latitude; // Land area latitude  
        uint256 longitude; // Land area longitude  
    }

    // Struct to represent user's location and credit
    struct User {
        address userAddress;
        uint256 creditBalance;
        uint256 latitude; // User's latitude  
        uint256 longitude; // User's longitude 
    }

    // Mapping to associate land areas with their owners and prices
    mapping(uint256 => mapping(uint256 => LandArea)) public landAreas;

    // Mapping to keep track of users
    mapping(address => User) public users;

    constructor() ERC20("Toll", "TOLL") {
        //_setupRole(DEFAULT_OWNER_ROLE, msg.sender); //owner controlls the land prices
        _setupRole(MINTER_ROLE, msg.sender); //owner controls the coin mint
    }

    // Function that allows minting by the owner 
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // Function to grant the LAND_OWNER_ROLE. initially only to the owner. the owner can then grant 
    //permission to others through grantLandOwnerRole(address). may not need that
    function grantLandOwnerRole(address user) public { //onlyRole(DEFAULT_OWNER_ROLE)
        _setupRole(LAND_OWNER_ROLE, user);
    }

    // Function to buy land areas
    function buyLandArea(uint256 latitude, uint256 longitude) external payable {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        _setupRole(LAND_OWNER_ROLE, user); //become owners immediately wo restriction

        //require(hasRole(LAND_OWNER_ROLE, msg.sender), "You are not permitted to buy this land at the moment.");
        require(msg.value >= LAND_PRICE_IN_DOLLARS * 1e18, "Insufficient payment");
        require(landAreas[gridLatitude][gridLongitude].owner == address(0), "Land area is already owned");

        landAreas[gridLatitude][gridLongitude].owner = msg.sender;
        landAreas[gridLatitude][gridLongitude].price = LAND_PRICE_IN_DOLLARS * 1e18;
        landAreas[gridLatitude][gridLongitude].latitude = latitude;
        landAreas[gridLatitude][gridLongitude].longitude = longitude;
    }

    // Function to update land area price (only the deployer of the contract can access)
    function updateLandAreaPrice(uint256 latitude, uint256 longitude, uint256 newPrice) external onlyRole(MINTER_ROLE) {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        //require(hasRole(LAND_OWNER_ROLE, msg.sender), "You are not a land owner");
        //require(landAreas[gridLatitude][gridLongitude].owner == msg.sender, "You don't own this land");

        landAreas[gridLatitude][gridLongitude].price = newPrice;
    }

    // Function to deposit credits to the user's account
    function depositCredits(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    //NOT COMPLETE  Function to handle automatic payments when users cross a land area
    function processPayment(uint256 latitude, uint256 longitude) external {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;
        address ownerAddress = landAreas[gridLatitude][gridLongitude].owner;
        uint256 paymentAmount = landAreas[gridLatitude][gridLongitude].price;

        require(ownerAddress != address(0), "Land area is not owned");
        require(balanceOf(msg.sender) >= paymentAmount, "Insufficient credit balance");

        _transfer(msg.sender, ownerAddress, paymentAmount);
    }

    // Function to burn tokens (eg when a user exits the platform)
    function burnTokens(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Function to get the user's credit balance
    function getCreditBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }

    //NOT COMPLETE /not needed Function to update the user's GPS location
    function updateLocation(uint256 latitude, uint256 longitude) external {
        users[msg.sender].latitude = latitude;
        users[msg.sender].longitude = longitude;
    }
}
