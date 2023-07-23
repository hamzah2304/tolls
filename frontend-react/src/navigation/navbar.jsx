import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../Navbar.css";

import ModalWithButton from '../components/ModalWithButton'
import Modal from '../components/Modal'

import { useSigner } from 'wagmi';


export default function Navbar({purchaseModalOpenState, tollModalOpenState, readYourselfModalOpenState,readOtherModalOpenState,ownedState}) {
  
  {/* const {data: signer} = useSigner(); */}
  {/* const web3 = new Web3((signer?.provider as any).provider); */}
  
  let [purchaseModalOpen,setPurchaseModalOpen] = purchaseModalOpenState;
  let [owned,setOwned] = ownedState;
  return (
    <nav class="navbar">
      <a href="http:localhost:3000/" target={"_blank"}>
        <div>
          <h2 class="navtitle">Tolls</h2>
          {/* <img src="/tollslogo.png"/> */}
        </div>
        {/* <img className={styles.alchemy_logo} src="/cw3d-logo.png"></img> */}
      </a>
      <div className='btns-right'>
        <Modal title={"You wanna buy this land??"} openstate={purchaseModalOpenState} successbtntext={"Buy"} successbtnOnClick={()=>{
          setOwned((prevState) => ({
            ...prevState,
            [purchaseModalOpen.rely]:{
              ...(prevState[purchaseModalOpen.rely] || {}),
              [purchaseModalOpen.relx]:'yourself'
            }
          }));
        }}>
          <p>Try to buy this land lol. It will cost you 100 TOLL</p>
        </Modal>
        <Modal title={"You own this land"} openstate={readYourselfModalOpenState} >
          <p>You own this land lol</p>  
        </Modal>
        <Modal title={"This land is owned"} openstate={readOtherModalOpenState} >
          <p>This land is owned lol</p>  
        </Modal>
        <Modal title={"A toll is due"} openstate={tollModalOpenState} >
          <p>You owe 10 TOLL for passing through someone's land.</p>  
        </Modal>
        <ModalWithButton title={"Deposit TOLL Tokens"} btntext={"Deposit TOLL"} successbtntext={"Deposit"} successbtnOnClick={()=>{
          
        }}>
          <p>Choose amount to deposit:</p>  
          <input className={'deposit-toll'} placeholder={'10 TOLL'}></input>
        </ModalWithButton>
        <ModalWithButton title={"TOLL Balance"} btnimg={"/TOLL.png"} btntext={"10 TOLL"}>
          <p>You have 10 TOLL in your account</p>  
          <a href="https://etherscan.io/">Check etherscan</a>
        </ModalWithButton>
        <ConnectButton></ConnectButton>
      </div>
    </nav>
  );
}
