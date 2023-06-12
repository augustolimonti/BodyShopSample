import './App.css';
import Home from './pages/Home';
import Traits from './pages/Traits';
import Nav from './pages/Nav';
import Customize from './pages/Customize';
import React, { FC, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletWrapper } from './components/UI/StyledComponents';
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';


import { clusterApiUrl } from '@solana/web3.js';
import { ThemeProvider } from 'styled-components';

require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const network = process.env.REACT_APP_SOLANA_NETWORK;
  const endpoint = process.env.QUICKNODE;

  const [background, setBackground] = useState('homepage');
  const pageHeight = window.innerHeight;
  const currentPage = window.location.href;
  const path = window.location.pathname.replace('/', '');

  const [projectDict, setProjectDict] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [isNotClient, setIsNotClient] = useState(true)
  const [blockchain, setBlockhain] = useState(1);

  useEffect(() => {
    if (path){
      var data = JSON.stringify({
        pathName: path,
      });

      var config = {
        method: 'post',
        url: 'https://rmbl36wkd5.execute-api.us-east-1.amazonaws.com/Production/getproject',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          console.log(response)
          if (response.data.isClient){
            if (response.data.chain === "SOL"){
              setProjectDict({
                projectID: response.data.projectID,
                projectLink: response.data.projectLink,
                projectHash: response.data.projectHash,
                projectName: response.data.projectName,
                projectCreator: response.data.projectCreator,
                projectLogo: response.data.logoURL,
                projectColors: response.data?.projectColors,
                projectTraitCollectionHash: response.data.projectTraitCollectionHash,
                swapTraits: response.data.swapTraits,
                fusions: response.data.fusions,
                mutations: response.data.mutations,
                slotMachine: response.data.slotMachine,
                hasReferral: response.data.hasReferral,
                referralWallet: response.data.referralWallet,
                referralPercentage: response.data.referralPercentage,
                hasFusionFee: response.data.hasFusionFee,
                fusionFeeCurrency: response.data.fusionFeeCurrency,
                fusionFeePrice: response.data.fusionFeePrice,
                twitterHandle: response.data.twitterHandle,
                discordURL: response.data.discordURL,
                magicEdenURL: response.data.magicEdenURL,
                projectTitle: response.data.projectTitle
              });
              setIsLoading(false);
              setIsNotClient(false)
              setBlockhain(1)
            }
            else if (response.data.chain === "POLY"){
              setProjectDict({
                projectID: response.data.projectID,
                projectName: response.data.projectName,
                projectCreator: response.data.projectCreator,
                projectLogo: response.data.logoURL,
                projectCollectionAddress: response.data.projectCollectionAddress,
                projectCollectionSupply: response.data.projectCollectionSupply,
                twitterHandle: response.data.twitterHandle,
                discordURL: response.data.discordURL,
                magicEdenURL: response.data.magicEdenURL,
                projectTitle: response.data.projectTitle,
                projectIdentifier: response.data.projectIdentifier,
                projectInitImage: response.data.projectInitImage
              });
              setIsLoading(false);
              setIsNotClient(false)
              setBlockhain(0)
            }
          }
          else{
            setIsLoading(false)
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <div className="w-full">
      {
        isLoading || isNotClient ?
          <Home />
          :
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                  <ThemeProvider theme={{} || projectDict?.projectColors}>
                    <div>
                      <Nav
                        projectName={projectDict.projectName}
                        projectHashURL={projectDict.projectHash}
                        projectLink={projectDict.projectLink}
                        projectID={projectDict.projectID}
                        projectCreator={projectDict.projectCreator}
                        projectLogo={projectDict.projectLogo}
                        projectTraitCollectionHash={projectDict.projectTraitCollectionHash}
                        swapTraits={projectDict.swapTraits}
                        fusions={projectDict.fusions}
                        mutations={projectDict.mutations}
                        slotMachine={projectDict.slotMachine}
                        hasReferral={projectDict.hasReferral}
                        referralWallet={projectDict.referralWallet}
                        referralPercentage={projectDict.referralPercentage}
                        hasFusionFee={projectDict.hasFusionFee}
                        fusionFeeCurrency={projectDict.fusionFeeCurrency}
                        fusionFeePrice={projectDict.fusionFeePrice}
                        twitterHandle={projectDict.twitterHandle}
                        discordURL={projectDict.discordURL}
                        magicEdenURL={projectDict.magicEdenURL}
                        projectTitle={projectDict.projectTitle}
                      >
                        <div className="">
                          <WalletMultiButton
                            className="customButton"
                          />
                        </div>
                      </Nav>
                    </div>
                  </ThemeProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
      }
    </div>
  );
}

export default App;
