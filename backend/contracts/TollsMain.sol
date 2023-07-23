// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

// LandArea structs - do we construct 10 of them in the constructor? Or do we construct them as they are purchased?
// Assume the toll_amount is the same as purchase price

contract TollsMain {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LAND_OWNER_ROLE = keccak256("LAND_OWNER_ROLE");
    uint256 public constant LAND_PRICE_DEFAULT = 0; // Default price in MATIC

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
    event CreditDeposited(address indexed user, uint256 amount);

    // Structs
    // These are users and areas structs. They are then mapped to create total area and total user pool.
    // Struct to represent land areas and owners
    struct LandArea {
        address owner;
        uint256 latitude; // Land area latitude
        uint256 longitude; // Land area longitude
        uint256 price;
    }
    // Struct to represent user's location and credit
    struct User {
        address user;
        uint256 latitude; // User's latitude
        uint256 longitude; // User's longitude
        uint256 creditBalance;
    }

    // Mappings
    // Mapping to associate land areas with their owners and prices
    mapping(uint256 => mapping(uint256 => LandArea)) public landAreas;

    // Mapping to keep track of users
    mapping(address => User) public users;

    //Mapping to keep track of user credit
    mapping(address => uint256) public userCredit;

    //Functions

    //Function to buy land area
    function buyLandArea(uint256 latitude, uint256 longitude) external payable {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        // Check if sufficient value is sent
        require(msg.value >= LAND_PRICE_DEFAULT, "Insufficient payment");

        // Check if land is already owned
        require(
            landAreas[gridLatitude][gridLongitude].owner == address(0),
            "Land area is already owned"
        );

        // Update mappings
        landAreas[gridLatitude][gridLongitude].owner = msg.sender;
        landAreas[gridLatitude][gridLongitude].price = LAND_PRICE_DEFAULT;
        landAreas[gridLatitude][gridLongitude].latitude = latitude;
        landAreas[gridLatitude][gridLongitude].longitude = longitude;

        //Emit once purchased
        emit LandAreaPurchased(
            msg.sender,
            gridLatitude,
            gridLongitude,
            landAreas[gridLatitude][gridLongitude].price
        );
    }

    // Function to update land area price
    function updateLandAreaPrice(
        uint256 latitude,
        uint256 longitude,
        uint256 newPrice
    ) external {
        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;

        require(
            landAreas[gridLatitude][gridLongitude].owner == msg.sender,
            "You are not permitted to change the price"
        );

        landAreas[gridLatitude][gridLongitude].price = newPrice;
    }

    // Function to deposit credits to the user's account
    function depositCredits(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        userCredit[msg.sender] += amount;
        emit CreditDeposited(msg.sender, amount);
    }

    // Function to get the user's credit balance
    function getCreditBalance(address account) external view returns (uint256) {
        return userCredit[account];
    }

    // The areas are 10x10. the location should contantly be fetched by some function
    // on the GPS side. Any time a new 10x10 is entered, ownership is checked. If it is owned by someone
    // who is not you, you have to pay. LOGIC: updateLocation -> createPayment (if owned)

    //Function to handle trespassing payment
    function createPayment(
        address user,
        address owner,
        uint256 paymentAmount,
        uint256 latitude,
        uint256 longitude
    ) internal {
        require(
            address(this).balance >= paymentAmount,
            "Insufficient balance for payment"
        );
        (bool success, ) = owner.call{value: paymentAmount}("");
        require(success, "Payment failed");
        emit TollPayment(msg.sender, latitude, longitude, paymentAmount);
        userCredit[user] -= paymentAmount;
    }

    // Function to update the user's GPS location and check if a new square is entered and whether it is owned,
    // then initiate the payment
    function updateLocation(uint256 latitude, uint256 longitude) external {
        users[msg.sender].latitude = latitude;
        users[msg.sender].longitude = longitude;

        uint256 gridLatitude = latitude / 1;
        uint256 gridLongitude = longitude / 1;
        address landOwner = landAreas[gridLatitude][gridLongitude].owner;

        // Check if the land belongs to someone and that person is not the user
        if (landOwner != address(0) && landOwner != msg.sender) {
            uint256 paymentAmount = landAreas[gridLatitude][gridLongitude]
                .price;
            createPayment(
                msg.sender,
                landOwner,
                paymentAmount,
                latitude,
                longitude
            );
        }
    }
}
