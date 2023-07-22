import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../Navbar.css";
import React, { useState } from "react";

export default function ModalWithButton({children,title,btntext,btnimg="",successbtntext="",successbtnOnClick}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
	<>
	  <div className='custom-btn' onClick={()=>{
		if (!isOpen) setIsOpen(true);
	  }}>
	  	{btnimg ? <img src={btnimg}/> : <></>}
		<p className='p-desc'>{btntext}</p>
	  </div>
	  {isOpen && (
		<>
			<div className="dark-bg-popup"></div>
			<div className="popup">
				<div className="popup-inner">
					<div className="popup-top-line">
						<h3>{title}</h3>
						<div className="btns-row-right-close">
							<div className='custom-btn' onClick={()=>{
								setIsOpen(false);
							}}>	
								<p className='p-desc'>Close</p>
							</div>
						</div>
					</div>
					{children}
					{successbtntext ? (
						<div className="btns-row-right-done">
							<div className='custom-btn' onClick={()=>{
								successbtnOnClick();
								setIsOpen(false);
							}}>	
								<p className='p-desc'>{successbtntext}</p>
							</div>
						</div>
					) : <></>}
				</div>
			</div>
		</>
	  )}
	</>
  );
}