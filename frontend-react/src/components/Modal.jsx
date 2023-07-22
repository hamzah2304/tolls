import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../Navbar.css";
import React, { useState } from "react";

export default function Modal({children,title,openstate,successbtntext="",successbtnOnClick}) {
  const [isOpen, setIsOpen] = openstate;

  return (
	<>
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