import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../Navbar.css";

import React, { useState, useEffect, useRef } from "react";

import ModalWithButton from "../components/ModalWithButton";
import Modal from "../components/Modal";

import { useSigner, useAccount } from "wagmi";

import {
  tollsMainContract,
  getUserCredit,
  loadCurrentMessage,
  getUserInfo,
  updateMessage,
  writeUserLocation,
  depositTokens,
  buyLand,
  getLandInfo,
} from "../interact";

export default function Navbar({
  purchaseModalOpenState,
  tollModalOpenState,
  readYourselfModalOpenState,
  readOtherModalOpenState,
  ownedState,
}) {
  {
    /* const {data: signer} = useSigner(); */
  }
  {
    /* const web3 = new Web3((signer?.provider as any).provider); */
  }

  let [purchaseModalOpen, setPurchaseModalOpen] = purchaseModalOpenState;
  let [owned, setOwned] = ownedState;

  const [balance, setBalance] = useState("No balance retrieved");
  const [userInfo, setUserInfo] = useState();
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");

  const [tokenAmount, setTokenAmount] = useState("");

  const { address } = useAccount();

  const handleTokenAmountChange = (event) => {
    setTokenAmount(event.target.value);
  };

  const handleDepositFormSubmit = async (tokenAmount) => {
    // Call the function to handle the form submission (e.g., send a transaction)
    console.log("attempting to deposit credits...");
    const { status } = await depositTokens(tokenAmount, address);
    setStatus(status);

    // Optionally, reset the form fields after submission
    setTokenAmount("");
  };

  async function getBalance() {
    const retrievedBalance = await getUserCredit(
      "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
    );
    setBalance(retrievedBalance);
  }

  function addSmartContractListener() {
    tollsMainContract.events.TollPayment({}, (error, data) => {
      if (error) {
        console.log("event listener error:", error.message);
      } else {
        getBalance();
        console.log("Toll payment made");
      }
    });
  }

  useEffect(() => {
    async function retrieveUserInfo() {
      const retrievedUserInfo = await getUserInfo(
        "0xD26a77BE873CDc25F0238634326f85986E6cBd1F"
      );
      console.log(retrieveUserInfo);
      const retrievedUserLocation = [
        retrievedUserInfo.latitude,
        retrievedUserInfo.longitude,
      ];
      setUserInfo(retrievedUserLocation);
    }

    getBalance();
    retrieveUserInfo();
    addSmartContractListener();
  }, []);

  return (
    <nav class="navbar">
      <a href="http:localhost:3000/" target={"_blank"}>
        <div>
          <h2 class="navtitle">Tolls</h2>
          {/* <img src="/tollslogo.png"/> */}
        </div>
        {/* <img className={styles.alchemy_logo} src="/cw3d-logo.png"></img> */}
      </a>
      <div className="btns-right">
        <Modal
          title={"You wanna buy this land??"}
          openstate={purchaseModalOpenState}
          successbtntext={"Buy"}
          successbtnOnClick={() => {
            setOwned((prevState) => ({
              ...prevState,
              [purchaseModalOpen.rely]: {
                ...(prevState[purchaseModalOpen.rely] || {}),
                [purchaseModalOpen.relx]: "yourself",
              },
            }));
          }}
        >
          <p>Try to buy this land lol. It will cost you 100 TOLL</p>
        </Modal>
        <Modal
          title={"You own this land"}
          openstate={readYourselfModalOpenState}
        >
          <p>You own this land lol</p>
        </Modal>
        <Modal title={"This land is owned"} openstate={readOtherModalOpenState}>
          <p>This land is owned lol</p>
        </Modal>
        <Modal title={"A toll is due"} openstate={tollModalOpenState}>
          <p>You owe {10} TOLL for passing through someone's land.</p>
        </Modal>
        <ModalWithButton
          title={"Deposit TOLL Tokens"}
          btntext={"Deposit TOLL"}
          successbtntext={"Deposit"}
          successbtnOnClick={() => {
            handleDepositFormSubmit(tokenAmount);
          }}
        >
          <p>Choose amount to deposit:</p>
          <input
            type="number"
            id="token_amount"
            value={tokenAmount}
            onChange={handleTokenAmountChange}
            required
            className={"deposit-toll"}
            placeholder={`${balance} TOLL`}
          />
        </ModalWithButton>
        <ModalWithButton title={"TOLL Balance"} btnimg={"/TOLL.png"} btntext={`${balance} TOLL`}>
          <p>You have {balance} TOLL in your account</p>  
          <a href="https://etherscan.io/">Check etherscan</a>
        </ModalWithButton>
        <ConnectButton></ConnectButton>
      </div>
    </nav>
  );
}
