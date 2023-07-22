// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Things to do
// LandArea structs - do we construct 10 of them in the constructor? Or do we construct them as they are purchased?
// Assume the toll_amount is the same as purchase price

contract TollsMain {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LAND_OWNER_ROLE = keccak256("LAND_OWNER_ROLE");
    uint256 public constant LAND_PRICE_IN_DOLLARS = 10; // Default price in dollars

    // Events
    event TollPayment(
        address indexed user,
        uint256 latitude,
        uint256 longitude,
        uint256 toll_amount
    );

    event LandAreaPurchased(
        address indexed buyer,
        uint256 latitude,
        uint256 longitude,
        uint256 price
    );

    // Structs
    // There are users and areas which are structs.
    // They are then mapped to create total area and total user pool

    // Struct to represent land areas and owners
    struct LandArea {
        address owner;
        uint256 latitude; // Land area latitude
        uint256 longitude; // Land area longitude
        uint256 price;
    }

    // Struct to represent user's location and credit
    struct User {
        address userAddress;
        uint256 creditBalance;
        uint256 latitude; // User's latitude
        uint256 longitude; // User's longitude
    }

    // Mappings

    // Mapping to associate land areas with their owners and prices
    mapping(uint256 => mapping(uint256 => LandArea)) public landAreas;

    // Mapping to keep track of users
    mapping(address => User) public users;

    mapping(address => uint256) public userCredit;




    // Function to grant the LAND_OWNER_ROLE. initially only to the owner. the owner can then grant 
    //permission to others through grantLandOwnerRole(address). may not need that
    //function grantLandOwnerRole(address user) public { //onlyRole(DEFAULT_OWNER_ROLE)
    //    _setupRole(LAND_OWNER_ROLE, user);
    //}

    // Function to buy land area
    function buyLandArea(uint256 latitude, uint256 longitude) external payable {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        //_setupRole(LAND_OWNER_ROLE, user); //become owners immediately wo restriction

        // Fix to 0.1 MATIC OR ETH etc
        // Check if sufficient value is sent
        require(
            msg.value == LAND_PRICE_IN_DOLLARS * 1e18,
            "Insufficient payment"
        );

        // Check if land is already owned
        require(
            landAreas[gridLatitude][gridLongitude].owner == address(0),
            "Land area is already owned"
        );

        // Update mappings
        landAreas[gridLatitude][gridLongitude].owner = msg.sender;
        landAreas[gridLatitude][gridLongitude].price =
            LAND_PRICE_IN_DOLLARS *
            1e18;
        landAreas[gridLatitude][gridLongitude].latitude = latitude;
        landAreas[gridLatitude][gridLongitude].longitude = longitude;

        emit LandAreaPurchased(msg.sender, gridLatitude, gridLongitude, landAreas[gridLatitude][gridLongitude].price);
    }


    // Function to update land area price (only the deployer of the contract can access)
    function updateLandAreaPrice(uint256 latitude, uint256 longitude, uint256 newPrice) external {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        //require(hasRole(LAND_OWNER_ROLE, msg.sender), "You are not a land owner");
        //require(landAreas[gridLatitude][gridLongitude].owner == msg.sender, "You don't own this land");

        landAreas[gridLatitude][gridLongitude].price = newPrice;
    }

    // Function to deposit credits to the user's account
    // Security stuff!!!!!

    function depositCredits(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero");
        userCredit[msg.sender] += amount;
    }

    // Function to burn tokens (eg when a user exits the platform)
    //function burnTokens(uint256 amount) external {
    //    _burn(msg.sender, amount);
    //}

            // emit Event
        // other stuff

    // Function to get the user's credit balance
    function getBalance(address account) external view returns (uint256) {
        return account.balance;
    }

    // The areas are 10x10. the location should contantly be fetched by some function
    // on the GPS side. wny time a new 10x10 is entered, ownership is checked. if it is owned by someone
    // who is not you, you have to pay 10$.
    // updateLocation -> createPayment (if owned)



    function createPayment(address user, address landOwner, uint256 paymentAmount, uint256 latitude, uint256 longitude) internal {
        require(address(this).balance >= paymentAmount, "Insufficient contract balance for payment");
        (bool success, ) = landOwner.call{value: paymentAmount}("");
        require(success, "Payment failed");
        emit TollPayment(msg.sender, latitude, longitude, paymentAmount);

        userCredit[user] -= paymentAmount;
    
        emit TollPayment(
            user,
            uint256(latitude),
            uint256(longitude),
            paymentAmount
        );
    }

    // Function to update the user's GPS location and check if a new square is entered and whether it is owned,
    // then initiate the payment
    function updateLocation(uint256 latitude, uint256 longitude) external {
        users[msg.sender].latitude = latitude;
        users[msg.sender].longitude = longitude;

        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        // Check if there exists an owner
        if (landAreas[gridLatitude][gridLongitude].owner == address(0)) {
            address landOwner = landAreas[gridLatitude][gridLongitude].owner;
            // Is the owner the user? If not: 
            if (landOwner != msg.sender) {
                uint256 paymentAmount = landAreas[gridLatitude][gridLongitude].price;
                createPayment(msg.sender, landOwner, paymentAmount, latitude, longitude);
            }
     
        }
    }
}
