import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useCallback, useState, useEffect } from "react";
// this is what we need to replace with another call
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import pointer from "../img/pointer.svg";
import noPicture from "../img/no-picture.svg";
import * as web3 from "@solana/web3.js";
import axios from "axios";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
import Loader from "../img/loading.gif";
import Reload from "../img/reload.png";
import Failed from "../img/failedtransaction.png";
import NotAllowed from "../img/not_allowed.png";
import NoImage from "../img/no-image.png";
import Backdrop from "../components/UI/Backdrop";
import { P, SelectNFTBtn } from "../components/UI/StyledComponents";
import { useTheme } from "styled-components";
import DropDown from "../components/UI/DropDown/DropDown";
import { Checkmark } from 'react-checkmark'

const Customize = (props) => {
  const theme = useTheme();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [screenSize, setScreenSize] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupState, setPopupState] = useState("default");

  const swapTraits = props.swapTraits;
  const projectHashURL = props.projectHashURL;

  const [walletNFTs, setWalletNFTs] = useState([]);
  const [ownedNFTDict, setOwnedNFTDict] = useState({ Base: {} });

  // booleans
  const [fetchedWalletNFTs, setFetchedWalletNFTs] = useState(false);
  const [fetchedProjectsTraits, setFetchedProjectsTraits] = useState(false);
  const [readyToUpgrade, setReadyToUpgrade] = useState(false);
  const [showNFTPopup, setShowNFTPopup] = useState(false);
  const [upgradeError, setUpgradeError] = useState(false);
  const [filteredProjectNFTs, setFilteredProjectNFTs] = useState(false);
  const [filteredProjectTraits, setFilteredProjectTraits] = useState(false);

  // project variables
  const [upgradeCategory, setUpgradeCategory] = useState();
  const [upgradeNameDict, setUpgradeNameDict] = useState({});
  const [traitDict, setTraitDict] = useState({});
  const [traitHashArray, setTraitHashArray] = useState([]);
  const [projectHashArray, setProjectHashArray] = useState([]);
  const [hasUpgrade, setHasUpgrade] = useState(0);
  const [builderState, setBuilderState] = useState("Base");
  const [assetDict, setAssetDict] = useState({});
  const [upgradingProjectNFTs, setUpgradingProjectNFTs] = useState({});

  // user variables
  const [digitalArray, setDigitalArray] = useState([]);
  const [userTraitNFTs, setUserTraitNFTs] = useState({});
  const [userProjectNFTs, setUserProjectNFTs] = useState({ Base: [] });
  const [userTraitCategories, setUserTraitCategories] = useState({ Base: [] });

  // render variables
  const [selectedNFT, setSelectedNFT] = useState();
  const [selectedTrait, setSelectedTrait] = useState();
  const [swappedTrait, setSwappedTrait] = useState();
  const [selectedTraitCategory, setSelectedTraitCategory] = useState("All Traits");
  const [imageArray, setImageArray] = useState();
  const [metadataLink, setMetadataLink] = useState();
  const [upgradeMetadata, setUpgradeMetadata] = useState();
  const [upgradeIDMetadata, setUpgradeIDMetadata] = useState();
  const [sortedData, setSortedData] = useState();

  useEffect(() => {
    if (window) {
      const screenWidth = window.innerWidth;
      screenWidth > 1279 && setShowResult(false);
      setScreenSize(screenWidth);
    }
  }, []);
  useEffect(() => {
    const isMobile = window && window.innerWidth < 1280;

    if ([imageArray?.length > 0, isMobile].every(Boolean)) {
      setShowResult(true);
    }
  }, [imageArray]);

  // Grabbing the wallet NFTs - will only grab it once
  // TODO: reload NFTs on a wallet change (new connection, disconnect, and change wallet)
  useEffect(() => {
    if (publicKey && !fetchedWalletNFTs) {
      const getNFTs = async () => {
        let myNfts = await getParsedNftAccountsByOwner({
          publicAddress: publicKey.toBase58(),
          connection: connection,
          serialization: true,
        });
        let walletDictTemp = {};
        myNfts.forEach((nft) => {
          walletDictTemp[nft.mint] = nft.data.uri;
        });
        setFetchedWalletNFTs(true);
        setWalletNFTs(myNfts);
      };
      getNFTs();
    }

    if (publicKey && !fetchedProjectsTraits) {
      var data = JSON.stringify({
        projectID: props.projectID,
        action: "setCustomizer2",
        userWallet: publicKey.toBase58(),
      });

      var config = { //not available in sample code
      };

      axios(config)
        .then(function (response) {
          if (response.data.hasUpgrade) {
            setHasUpgrade(1);
            setUpgradeCategory(response.data.upgradeCategory);
            setUpgradeNameDict(response.data.upgradeNameDict);
            let ownedDictTemp = {};
            Object.keys(response.data.assetDict).forEach((upgradeName) => {
              ownedDictTemp[upgradeName] = {};
            });
            setOwnedNFTDict(ownedDictTemp);
          }
          setTraitDict(response.data.traitDict);
          setTraitHashArray(response.data.traitHashArray);
          setDigitalArray(response.data.digitalArray);

          setAssetDict(response.data.assetDict);
          setUpgradingProjectNFTs(response.data.upgradingNFTDict);
          setFetchedProjectsTraits(true);
        })
        .catch(function (error) {
          // // console.log(error);
        });
    }
  }, [publicKey, fetchedWalletNFTs, fetchedProjectsTraits]);

  // grabbing the hashlist from a given project
  useEffect(() => {
    if (projectHashURL && !projectHashArray.length) {
      var config = {
        method: "get",
        url: projectHashURL,
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then(function (response) {
          setProjectHashArray(response.data);
        })
        .catch(function (error) {
          // // console.log(error);
        });
    }
  }, [projectHashURL]);

  // grabbing all eligible projectNFTs
  useEffect(() => {
    if (
      walletNFTs.length &&
      projectHashArray.length &&
      fetchedProjectsTraits &&
      !filteredProjectNFTs
    ) {
      const filterUserNFTs = async () => {
        let ownedNFTDictTemp = { ...ownedNFTDict };

        await walletNFTs.map(async (nft) => {
          if (projectHashArray.includes(nft.mint)) {
            var config = {
              method: "get",
              url: nft.data.uri + "?nocache=" + new Date().getTime(),
              headers: {
                "Content-Type": "application/json",
              },
            };

            let nftTemp = await axios(config).then((results) => {
              return results.data;
            });

            if (hasUpgrade) {
              let upgradeName = "Base";
              nftTemp.attributes.forEach((attribute) => {
                if (attribute.trait_type === upgradeCategory) {
                  if (Object.keys(upgradeNameDict).includes(attribute.value)) {
                    upgradeName = upgradeNameDict[attribute.value];
                  }
                }
              });

              var data = JSON.stringify({
                action: "checkIfMutating",
                projectID: props.projectID,
                nftHash: nft.mint,
                upgradeNameDict: upgradeNameDict,
                upgradeCategory: upgradeCategory,
              });

              var config = { //not available in sample code
              };

              axios(config).then(function (response) {
                console.log(response);
                if (response.data.upgradeName) {
                  upgradeName = response.data.upgradeName;
                }
                ownedNFTDictTemp[upgradeName][nft.mint] = {
                  ...nftTemp,
                  metadataLink: nft.data.uri,
                };
              });
              // console.log(upgradeName)
              // ownedNFTDictTemp[upgradeName][nft.mint] = {...nftTemp, metadataLink: nft.data.uri}
            } else {
              ownedNFTDictTemp["Base"][nft.mint] = { ...nftTemp, metadataLink: nft.data.uri };
            }
          }
        });
        setOwnedNFTDict(ownedNFTDictTemp);
        setUserProjectNFTs(ownedNFTDictTemp);
        setFilteredProjectNFTs(true);
      };
      filterUserNFTs();
    }
  }, [walletNFTs, projectHashArray, filteredProjectNFTs, fetchedProjectsTraits]);

  // grabbing all eligible traitNFTs
  useEffect(() => {
    if (
      walletNFTs.length &&
      Object.keys(traitDict).length &&
      fetchedProjectsTraits & !filteredProjectTraits
    ) {
      let ownedTraitDictTemp = {};
      let categoryTraitDictTemp = {};
      let addedIDs = [];

      walletNFTs.forEach((nft) => {
        if (traitHashArray.includes(nft.mint)) {
          let collectionName = traitDict[nft.mint]["collectionName"];
          if (Object.keys(ownedTraitDictTemp).includes(collectionName)) {
            if (!addedIDs.includes(traitDict[nft.mint]["assetID"])) {
              ownedTraitDictTemp[collectionName].push({ ...traitDict[nft.mint], hash: nft.mint });
              addedIDs.push(traitDict[nft.mint]["assetID"]);
            }
            if (!categoryTraitDictTemp[collectionName].includes(traitDict[nft.mint]["type"])) {
              categoryTraitDictTemp[collectionName].push(traitDict[nft.mint]["type"]);
            }
          } else {
            ownedTraitDictTemp[collectionName] = [{ ...traitDict[nft.mint], hash: nft.mint }];
            addedIDs.push(traitDict[nft.mint]["assetID"]);
            categoryTraitDictTemp[collectionName] = [traitDict[nft.mint]["type"]];
          }
        }
      });

      digitalArray.forEach((trait) => {
        if (Object.keys(ownedTraitDictTemp).includes(trait.collectionName)) {
          ownedTraitDictTemp[trait.collectionName].push({ ...trait });
          if (!categoryTraitDictTemp[trait.collectionName].includes(trait["type"])) {
            categoryTraitDictTemp[trait.collectionName].push(trait["type"]);
          }
        } else {
          ownedTraitDictTemp[trait.collectionName] = [{ ...trait }];
          categoryTraitDictTemp[trait.collectionName] = [trait["type"]];
        }
      });

      setUserTraitNFTs(ownedTraitDictTemp);
      setUserTraitCategories(categoryTraitDictTemp);
      setFilteredProjectTraits(true);
    }
  }, [walletNFTs, traitDict, fetchedProjectsTraits, filteredProjectTraits]);

  // render new image if combination is allowed or block upgrade if error returns
  useEffect(() => {
    if (selectedNFT && selectedTrait) {
      setImageArray();
      setReadyToUpgrade(false);
      setUpgradeMetadata();
      setUpgradeIDMetadata();
      setUpgradeError(false);
      var data = JSON.stringify({
        action: "setCustomizerImage2Test",
        projectID: props.projectID,
        selectedTrait: selectedTrait,
        selectedNFT: { ...userProjectNFTs[builderState][selectedNFT], hash: selectedNFT },
        collectionName: builderState,
        swap: swapTraits,
      });

      var config = { //not available in sample code
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          if (!response.data.error && !("errorMessage" in response.data)) {
            // console.log(response.data)
            setSortedData(response.data.finalSortedData);
            setImageArray(response.data.imageArray);
            setReadyToUpgrade(true);
            setUpgradeMetadata(response.data.metadata);
            setUpgradeIDMetadata(response.data.attributeIDDict);
            setMetadataLink(response.data.metadataLink);
            setSwappedTrait(response.data.swappedTrait);
          } else {
            setReadyToUpgrade(false);
            setUpgradeError(true);
          }
        })
        .catch(function (error) {
          // // console.log(error);
        });
    }
  }, [selectedNFT, selectedTrait]);

  const randomHash = (length) => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };

  // customization functionality.
  const transferTraitBurn = useCallback(async () => {
    // Here goes the customization functionality. Not currently available in sample code.
  }, []);

  // finalization of the transaction
  const confirmCustomization = async (signature, identifyingHash) => {
    // Here goes the confirmation of the customization. Not Currently Available in sample code.
  };

  // this is the just the render aspect, not the logic for creation of the image
  const renderImage = () => {
    // If an NFT has been chosen
    if (selectedNFT) {
      // If an NFT combination is not allowed - this is the hand image
      if (upgradeError) {
        return (
          <div className="w-full h-full aspect-square absolute top-0 left-0 rounded-xl rounded-b-none shadow-border flex justify-center items-center overflow-hidden">
            <img
              className="absolute  top-0 left-0  w-full h-full object-contain"
              src={NotAllowed}
            />
            <img
              className="absolute top-5 right-5 w-1/6 h-1/6 p-2 rounded-full bg-dark-gray shadow-thick hover:bg-gray hover:-translate-y-[2vh]"
              src={pointer}
              onClick={() => setCurrentPopup('nft')}
              alt="No NFT Picked"
            />
          </div>
        );
      }

      // If the combination was allowed and the NFT is set to upload
      else if (imageArray) {
        return (
          <div className="w-full h-full aspect-square absolute top-0 left-0 rounded-xl rounded-b-none shadow-border flex justify-center items-center overflow-hidden">
            {
              imageArray.map((layer, i) => {
                return(
                  <img
                    className="absolute top-0 left-0 w-full h-full"
                    key={i}
                    src={layer}
                    alt={`Image layer ${i + 1}`}
                  />
                )

              })
            }
            <img
              className="absolute top-5 right-5 w-1/6 h-1/6 p-2 rounded-full bg-dark-gray shadow-thick hover:bg-gray hover:-translate-y-[2vh]"
              src={pointer}
              onClick={() => setCurrentPopup('nft')}
              alt="No NFT Picked"
            />
          </div>
        );
      }

      // Selected image with no selected trait - only edit is if the NFT is upgrading it will show the latest image
      else {
        return (
          <div className="w-full h-full aspect-square absolute top-0 left-0 rounded-xl rounded-b-none shadow-border flex justify-center items-center overflow-hidden">
            {Object.keys(upgradingProjectNFTs).includes(selectedNFT) ? (
              <img
                className="w-full h-full"
                src={`${upgradingProjectNFTs[selectedNFT].image}?${new Date().getTime()}`}
              />
            ) : (
              <img
                className="w-full h-full"
                src={`${
                  userProjectNFTs[builderState][selectedNFT].image
                }?${new Date().getTime()}`}
              />
            )}
            <img
              className="absolute top-5 right-5 w-1/6 h-1/6 p-2 rounded-full bg-dark-gray shadow-thick hover:bg-gray hover:-translate-y-[2vh]"
              src={pointer}
              onClick={() => setCurrentPopup('nft')}
              alt="No NFT Picked"
            />
          </div>
        );
      }
    }
    // On first render and with no NFT selected
    else {
      return (
        <div className="w-full h-full aspect-square absolute top-0 left-0 rounded-xl rounded-b-none shadow-border flex justify-center items-center overflow-hidden bg-primary-yellow">
          <div className="w-1/5 h-1/5 p-2 rounded-full flex justify-center items-center bg-dark-gray hover:bg-gray hover:-translate-y-[2vh] shadow-thick">
            <img

              className="w-1/2 h-1/2 object-contain"
              src={pointer}
              onClick={() => publicKey && setCurrentPopup('nft')}
              alt="No NFT Picked"
            />
          </div>
          <p
            className="absolute bottom-16 xl:bottom-24  self-center text-xl xl:text-3xl rounded-md font-lekton-bold text-dark-gray py-1 px-2"
          >
              SELECT NFT TO BEGIN
          </p>
        </div>
      );
    }
  };

  // popups for pending, error, and successful
  const renderPopup = () => {
    if (popupState === "default") {
      return (
        <div style={{position:'fixed', bottom: 35, right: 35, zIndex:100}}>
          <div className="bg-gray rounded-md p-4 flex items-center">
            <img
              className="h-5 w-5 mr-4 animate-spin"
              src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"
              alt="Loading"
            />
            <p className="text-white font-lekton">Upgrade in progress - please follow the prompt on your wallet.</p>
          </div>
        </div>
      );
    }
    else if(popupState === "transactionError"){
      const timer = setTimeout(() => {
        resetPopup();
      }, 5000);

      return (
        <div style={{position:'fixed', bottom: 35, right: 35, zIndex:100}}>
          <>
            <div className="bg-gray rounded-md rounded-b-none p-4 flex items-center">
              <img
                className="h-5 w-5 mr-4"
                src={Failed}
                alt="Loading"
              />
              <p className="text-white font-lekton mr-2">Transaction Failed. Please Try Again.</p>
              <button
                onClick={() => {
                  resetPopup();
                }}
                className="text-white font-lekton bg-gray rounded-full w-5 h-5 flex items-center justify-center hover:bg-dark-gray"
              >
                &#10761;
              </button>
            </div>
            <div className="relative w-full h-1 bg-primary-red bg-opacity-30">
              <div className="absolute left-0 top-0 h-1 bg-primary-red animate-progress" />
            </div>
          </>
        </div>
      );
    }
    else if (popupState === "successfulPurchase") {
      const timer = setTimeout(() => {
        reloadData();
      }, 5000);

      return (
        <div style={{position:'fixed', bottom: 35, right: 35, zIndex:100}}>
          <>
            <div className="bg-gray rounded-md rounded-b-none p-4 flex items-center">
              <Checkmark size='24px'/>
              <p className="text-white font-lekton ml-2 mr-2">Congrats! Your upgrade was successful.</p>
              <button
                onClick={() => {
                  reloadData();
                }}
                className="text-white font-lekton bg-gray rounded-full w-5 h-5 flex items-center justify-center hover:bg-dark-gray"
              >
                &#10761;
              </button>
            </div>
            <div className="relative w-full h-1 bg-primary-red bg-opacity-30">
              <div className="absolute left-0 top-0 h-1 bg-primary-red animate-progress" />
            </div>
          </>
        </div>
      );
    }
  };

  const resetPopup = (reason) => {
    setPopup(false);
    setPopupState("default");
  };

  const reloadData = () => {
    setFetchedWalletNFTs(false);
    setFetchedProjectsTraits(false);
    setFilteredProjectNFTs(false);
    setFilteredProjectTraits(false);
    setSelectedNFT();
    setSelectedTrait();
    setPopup(false);
    setReadyToUpgrade(false);
    setPopupState("default");
  };

  const chooseNFT = (nftHash) => {
    setSelectedNFT(nftHash);
    setSelectedTrait(0);
    setImageArray();
    setUpgradeError(false);
    setShowNFTPopup(false);
  };

  const switchBuilderState = (builderStateTemp) => {
    setSelectedNFT();
    setSelectedTrait();
    setBuilderState(builderStateTemp);
  };

  const renderNFTs = () => {
    return(
      <div className="mt-4 flex-grow overflow-y-auto">
        {Object.keys(userProjectNFTs[builderState])?.length ? (
          <div className="w-full grid grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-12">
            {Object.keys(userProjectNFTs[builderState]).map((nftHash) => {
              if (!Object.keys(upgradingProjectNFTs).includes(nftHash)) {
                return (
                  <div class="">
                    <img
                      onClick={() => {
                        chooseNFT(nftHash);
                        setCurrentPopup("");
                      }}
                      src={`${
                        userProjectNFTs[builderState][nftHash].image
                      }?${new Date().getTime()}`}
                      className="w-full cursor-pointer border-2 border-dark-gray"
                      style={{ marginTop: 10, borderRadius: 10 }}
                    />
                    <p className="text-center py-2 text-gray-deep  font-text font-bold text-[12px] xl:text-2xl">
                      {userProjectNFTs[builderState][nftHash].name}
                    </p>

                  </div>
                );
              } else {
                return (
                  <div class="">
                    {upgradingProjectNFTs[nftHash].image ? (
                      <div class="">
                        <img
                          onClick={() => {
                            chooseNFT(nftHash);
                            setCurrentPopup("");
                          }}
                          src={`${
                            upgradingProjectNFTs[nftHash].image
                          }?${new Date().getTime()}`}
                          className="w-full cursor-pointer border-2 border-dark-gray"
                          style={{ marginTop: 10, borderRadius: 10 }}
                        />
                        <p className="text-center py-2 text-gray-deep  font-text font-bold text-[12px] xl:text-2xl">
                          {userProjectNFTs[builderState][nftHash].name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-[86.5%] bordercursor-pointer border-2 border-dark-gray flex justify-center items-center" style={{ marginTop: 10, borderRadius: 10 }}>
                          <img
                            src={Loader}
                            alt="loading..."
                            className="w-1/3"
                          />
                        </div>
                        <p className="text-center py-2 text-gray-deep  font-text font-bold text-[12px] xl:text-2xl">
                          {userProjectNFTs[builderState][nftHash].name}
                        </p>
                      </>
                    )}
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <P className="font-title-bold text-primary-red text-[24px] text-center mb-5 relative">
            There is no NFT in your wallet from this particular collection. <br></br>Please connect
            a new wallet and try again or switch the collection.
          </P>
        )}
      </div>
    )
  };
  const [currentPopup, setCurrentPopup] = useState("");

  return (
    <div className="w-full  h-full flex-grow flex-col flex px-5 xl:px-10 py-5 bg-[#8C838A] bg-opacity-10 ">
        {popup ? renderPopup() : <div></div>}
        <div className="flex justify-between w-full">
          <p className="text-lg md:text-4xl font-text font-bold text-bold text-dark-gray">CUSTOMIZER</p>
        </div>
        <div className="w-fit my-4">
          <DropDown
            value={builderState}
            selectValue={switchBuilderState}
            values={Object.keys(assetDict)}
          />
        </div>
        {
          currentPopup ?
          (
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-dark-gray text-lg xl:text-3xl font-text  relative">
                MY NFTs
              </p>
              <button
                className="font-title-regular  top-8 z-10 text-lg text-dark-gray uppercase"
                onClick={() => setCurrentPopup("")}
              >
                &#9664; Back
              </button>
            </div>
            { currentPopup === "nft" ?
                renderNFTs() :
                ""
            }
          </div>
        )
          :
          (
            <div className="grid  md:grid-cols-[1.5fr,1fr] gap-8 xl:gap-10 2xl:gap-16 relative p-1">
                <div className = "flex flex-col justify-center items-center">
                  <div className="w-[98.8%] sm:w-10/12 mx-auto h-0 pb-[100%] sm:pb-[83.33%] relative">
                    {renderImage()}
                  </div>
                  <button
                      disabled={!readyToUpgrade}
                      onClick={() => transferTraitBurn()}
                      className="w-full sm:w-[84.6%] xl:w-[83.9%] bg-dark-gray text-sm xl:text-2xl rounded-xl rounded-t-none border-2 border-dark-gray text-white py-4 px-3 disabled:bg-opacity-50 hover:bg-opacity-50"
                    >
                      UPGRADE
                  </button>
                </div>
                <div>
                  {userTraitCategories[builderState]?.length > 0 && (
                    <DropDown
                      value={selectedTraitCategory}
                      values={["All Traits", ...userTraitCategories[builderState]]}
                      selectValue={setSelectedTraitCategory}
                    />
                  )}
                  {!userTraitNFTs[builderState]?.length ? (
                    <>
                    <DropDown
                      value={"All Traits"}
                      values={[]}
                      selectValue={''}
                    />
                    <div className="max-w-[500px] mx-auto my-32">
                      <P className="font-title-bold text-primary-red text-[24px] text-center mb-5 relative">
                        It seems you have no traits for this given collection. Try a different
                        collection or connect a different wallet.
                      </P>
                    </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-h-[77vh] overflow-y-scroll">
                      {userTraitNFTs[builderState]
                        .filter((item) =>
                          selectedTraitCategory !== "All Traits"
                            ? item.type === selectedTraitCategory
                            : true
                        )
                        .map((nft) => {
                          const isSelected = selectedTrait?.traitID === nft.traitID;
                          return (
                            <>
                              {isSelected ? (
                                <img
                                  src={nft.image}
                                  onClick={() => {
                                    setSelectedTrait(nft);
                                    setCurrentPopup("");
                                  }}
                                  className={`w-full cursor-pointer border border-primary-red p-1 bg-white`}
                                  style={{
                                    marginTop: 10,
                                    borderRadius: 10,
                                    borderColor: theme?.color1,
                                  }}
                                />
                              ) : (
                                <img
                                  src={nft.image}
                                  onClick={() => {
                                    setSelectedTrait(nft);
                                    setCurrentPopup("");
                                  }}
                                  className={`w-full cursor-pointer border active:border-primary-red focus:border-primary-red p-1 bg-white`}
                                  style={{ marginTop: 10, borderRadius: 10 }}
                                />
                              )}
                            </>
                          );
                        })}
                    </div>
                  )}
                </div>
            </div>
          )
        }
    </div>
  );
};

export default Customize;
