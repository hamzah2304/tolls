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

        {/* <form onSubmit={handleDepositFormSubmit}>
          <div>
            <label htmlFor="token_amount">Amount:</label>
            <input
              type="number"
              id="token_amount"
              value={tokenAmount}
              onChange={handleTokenAmountChange}
              required
              className={"deposit-toll"}
              placeholder={`${balance} TOLL`}
            />
          </div>
          <button type="submit">Submit</button>
        </form> */}
        <ModalWithButton
          title={"TOLL Balance"}
          btnimg={
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQSIgeDE9Ii0xOC4yNzUlIiB4Mj0iODQuOTU5JSIgeTE9IjguMjE5JSIgeTI9IjcxLjM5MyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhMjI5YzUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3YjNmZTQiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgaWQ9IkIiIGN4PSIxNCIgY3k9IjE0IiByPSIxNCIvPjwvZGVmcz48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxtYXNrIGlkPSJDIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNCIi8+PC9tYXNrPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0idXJsKCNBKSIgZD0iTS0xLjMyNi0xLjMyNmgzMC42NTF2MzAuNjUxSC0xLjMyNnoiIG1hc2s9InVybCgjQykiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTguMDQ5IDE3LjAyMWwzLjk2LTIuMjg3YS42ODEuNjgxIDAgMCAwIC4zNC0uNTg5VjkuNTcyYS42ODMuNjgzIDAgMCAwLS4zNC0uNTlsLTMuOTYtMi4yODZhLjY4Mi42ODIgMCAwIDAtLjY4IDBsLTMuOTYgMi4yODdhLjY4Mi42ODIgMCAwIDAtLjM0LjU4OXY4LjE3M0wxMC4yOSAxOS4zNWwtMi43NzctMS42MDR2LTMuMjA3bDIuNzc3LTEuNjA0IDEuODMyIDEuMDU4VjExLjg0bC0xLjQ5Mi0uODYxYS42ODEuNjgxIDAgMCAwLS42OCAwbC0zLjk2IDIuMjg3YS42ODEuNjgxIDAgMCAwLS4zNC41ODl2NC41NzNjMCAuMjQyLjEzLjQ2OC4zNC41OWwzLjk2IDIuMjg2YS42OC42OCAwIDAgMCAuNjggMGwzLjk2LTIuMjg2YS42ODIuNjgyIDAgMCAwIC4zNC0uNTg5di04LjE3NGwuMDUtLjAyOCAyLjcyOC0xLjU3NSAyLjc3NyAxLjYwM3YzLjIwOGwtMi43NzcgMS42MDMtMS44My0xLjA1NnYyLjE1MWwxLjQ5Ljg2YS42OC42OCAwIDAgMCAuNjggMHoiLz48L2c+PC9nPjwvc3ZnPg=="
          }
          btntext={`${balance} TOLL`}
        >
          <p>You have {balance} TOLL in your account</p>
          <a href="https://etherscan.io/">Check etherscan</a>
        </ModalWithButton>
        <ConnectButton></ConnectButton>
      </div>
    </nav>
  );
}
