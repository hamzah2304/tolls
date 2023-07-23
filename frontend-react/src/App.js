import logo from "./logo.svg";
import "./App.css";
import Toby from "./test-toby";
import Hamzah from "./test-hamzah";
import Map from "./map";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import Navbar from "./navigation/navbar";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const PROJECT_ID = "3b38b17e081fe6c30ca1daa2abf6d021";

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: PROJECT_ID,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  let purchaseModalOpenState = useState({ open: false });
  let tollModalOpenState = useState({ open: false });
  let readOtherModalOpenState = useState({ open: false });
  let readYourselfModalOpenState = useState({ open: false });

  let ownedState = useState({
    0: {
      0: "yourself",
      1: "other",
      2: "other",
    },
    1: {
      "-1": "yourself",
      0: "yourself",
      1: "yourself",
      2: "other",
      3: "other",
    },
    2: {
      0: "other",
      1: "other",
    },
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Map
          purchaseModalOpenState={purchaseModalOpenState}
          tollModalOpenState={tollModalOpenState}
          ownedState={ownedState}
          readOtherModalOpenState={readOtherModalOpenState}
          readYourselfModalOpenState={readYourselfModalOpenState}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

// function App() {
//   return (
//     <Router>
//       {/* <Navbar /> */}
//       <div className="App">
//         <p>
//           <Link to="/test-toby">Test Toby</Link>
//         </p>
//         <p>
//           <Link to="/test-hamzah">Test Hamzah</Link>
//         </p>
//         <Routes>
//           <Route exact path="/test-toby" element={<Toby />}></Route>
//           <Route exact path="/test-hamzah" element={<Hamzah />}></Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

export default App;
