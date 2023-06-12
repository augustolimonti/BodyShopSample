import React, { useState, useEffect, useCallback } from "react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import * as web3 from "@solana/web3.js";
import axios from "axios";
import Loader from "../img/loading.gif";
import Failed from "../img/failedtransaction.png";
import { Checkmark } from 'react-checkmark'
import bs58 from "bs58";
import {
  getAccount,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import ProgressBar from "@ramonak/react-progress-bar";
import TraitsHeader from "../components/TraitsHeader";
import TraitItem from "../components/TraitItem";
import { BuyNowBtn, P } from "../components/UI/StyledComponents";
import { useTheme } from "styled-components";
import SemiCricle from "../components/UI/SemiCricle";
import DropDown from "../components/UI/DropDown/DropDown";

const Traits = (props) => {
  const theme = useTheme();

  //internal navigation
  const [page, setPage] = useState("bodyshop");
  const [selectedTraitCategory, setSelectedTraitCategory] = useState("All Traits");
  const [traitCategories, setTraitCategories] = useState([]);

  // web3 transactions
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  // purchasing popups
  const [popup, setPopup] = useState(false);
  const [popupState, setPopupState] = useState("");
  const [sentStatus, setSentStatus] = useState("default");

  // trait details
  const [allTraits, setAllTraits] = useState([]);
  const [selectedTrait, setSelectedTrait] = useState();
  const [gatingHash, setGatingHash] = useState();
  const [hasGated, setHasGated] = useState(false);

  // Variables for Trait Gating
  const [fetchedWalletNFTs, setFetchedWalletNFTs] = useState(false);
  const [allowed, setAllowed] = useState(false);

  // TODO: need to create a table in DB on all new currencies
  const currencyDict = {
    CA6nNPCCKhf4AEEnXBnzcxms4c4gu7scFrA2WRqczHoW: "$OTAKU",
    AxXoJZhSfeVUe3qgFZTt4NwQRJB61pBQAHTdWTN9PNms: "$KAYAC",
    popwcrLzjetHAFCH91LBTK78zapZ54Rftpc7PGoHpuh: "$POP",
    WERKZCY6o4eYu9cSh94s1RYC9rQG1parxuvwoW6FZAa: "$WERK",
    "97yD6vUGLUx4qUi8CpuGesvnrNMag4UxPfyQnYkEK1az": "$PEPE",
    XXX: "SOL",
    SOL: "SOL",
    "5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H": "$FRONK",
    CCxnn3XmZARNVNCS31z8zkcuDEQnR6oJQubrvUd1phFX: "$CC",
    "4cBCyMkxF6okc3ukMZz8wqZQyfv2F3fWiNzbQdDwFiuX": "PEPE",
    DchqyAmbwqXyH6QS36oVcHYjseCnx15E8Xp3sL6yvST9: "$PUSS",
    FzoYRdg3QfT3jEK7R3yExmoD1jxvUsJWyifTBWVKg2wJ: "$STAX",
    GoHuzGVzs5stYH9ZXu22hYd6Bw3a6EXE44K9iPDe4WNW: "$GOH",
  };

  useEffect(() => {
    // get all traits and save live ones
    var data = JSON.stringify({
      projectID: props.projectID,
      action: "getBodyShopTraits",
    });

    var config = { //not available in sample code
    };

    axios(config)
      .then(function (response) {
        var traits = [];
        var categories = response.data.typeDict
        categories.push('All Traits')
        var newArray = response.data.data.filter((nft) =>
            nft.isSlotTrait !== 1
        )
        newArray.forEach((trait) => {
          if (trait.live) {
            const traitInfo = {
              id: trait.id,
              name: trait.traitName,
              type: trait.type,
              creator: trait.createdBy,
              category: trait.category,
              supply: trait.supply,
              amountPurchased: trait.amountPurchased,
              soldOut: trait.soldOut,
              price: trait.price,
              currencyHash: trait.currencyHash,
              display: trait.image,
              description: trait.description,
              live: trait.live,
              identifyingHash: trait.identifyingHash,
              projectID: trait.projectID,
              SFTHash: trait.SFTHash,
              nftRequirementHash: trait.nftRequirementHash
            };
            traits.push(traitInfo);

          }

        });
        setAllTraits(traits);
        setTraitCategories(categories);
      })
      .catch(function (error) {
        // console.log(error);
      });
  }, []);

  // checking if the trait is sold out
  const checkQuantity = async (trait) => {
    var data = JSON.stringify({
      traitID: trait.id,
      action: "getTraitToPurchase",
    });

    var config = { //not available in sample code
    };

    let soldOut = axios(config)
      .then(function (response) {
        if (response.data.soldOut) {
          setPopupState("soldOutTrait");
          setPopup(true);
          return response.data.soldOut;
        } else {
          return response.data.soldOut;
        }
      })
      .catch(function (error) {
        setPopup(true);
        setPopupState("fetchingError");
        return { soldOut: 1 };
      });

    return soldOut;
  };

  // Purchasing Trait Functionality
  const purchaseTrait = useCallback(
    async (trait) => {
      setPopup(true)
      setPopupState("sampleCode")
      // Here goes the purchasing trait functionality. Not available in sample code.
    },
    [publicKey, sendTransaction, connection]
  );

  // log purchase into the DB
  const confirmPurchase = async (trait, publicKey, signature) => {
    // Here goes the confirmation of purchase trait functionality. Not available in sample code.
  };

  const toggleTrait = (trait) => {
    if (trait === "back") {
      setSelectedTrait(0);
      setPage("bodyshop");
    } else {
      setSelectedTrait(trait);
      setPage("details");
    }
  };

  // post purchase we reload the traits so that the quantities are updated
  const resetTraitShop = () => {
    var data = JSON.stringify({
      projectID: props.projectID,
      action: "getBodyShopTraits",
    });

    var config = { //not available in sample code
    };

    axios(config)
      .then(function (response) {
        var traits = [];
        var categories = response.data.typeDict
        categories.push('All Traits')
        var newArray = response.data.data.filter((nft) =>
            nft.isSlotTrait !== 1
        )
        newArray.forEach((trait) => {
          if (trait.live){
            const traitInfo = {
              id: trait.id,
              name: trait.traitName,
              type: trait.type,
              creator: trait.createdBy,
              category: trait.category,
              supply: trait.supply,
              amountPurchased: trait.amountPurchased,
              soldOut: trait.soldOut,
              price: trait.price,
              currencyHash: trait.currencyHash,
              display: trait.image,
              description: trait.description,
              live: trait.live,
              identifyingHash: trait.identifyingHash,
              projectID: trait.projectID,
              SFTHash: trait.SFTHash,
              nftRequirementHash: trait.nftRequirementHash
            };
            traits.push(traitInfo);
            if (selectedTrait.id === trait.id) {
              setSelectedTrait(traitInfo);
            }
          }
        });
        setAllTraits(traits)
        setTraitCategories(categories);
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  // remove the popup from the screen and reset the trait shop
  const resetPopup = () => {
    setPopup(false);
    setPopupState("");
    resetTraitShop();
  };

  // determines the type of popup that appears - toggled between pending, successful, and failed transaction
  const renderPopup = () => {
    if (popupState === "sampleCode") {
        const timer = setTimeout(() => {
          resetPopup();
        }, 5000);

        return (
          <div style={{position:'fixed', bottom: 35, right: 35, zIndex:100}}>
            <>
              <div className="bg-gray rounded-md rounded-b-none p-4 flex items-center">
                <Checkmark size='24px'/>
                <p className="text-white font-lekton ml-2 mr-2">This is just a sample code. Enjoy the demo!</p>
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
  };

  const traitHeaderProps = {
    traitCategories,
    selectedTraitCategory,
    setSelectedTrait,
    setSelectedTraitCategory,
    setPage,
  };

  return (
    <div className=" h-full flex-grow flex-col flex px-5 xl:px-10 py-5 bg-[#8C838A] bg-opacity-10">
      {popup ? renderPopup() : <div></div>}
      <div className=" min-h-full flex-grow">
        <div className="grid   gap-8  relative w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-3 xl:gap-5">
              {" "}
              <p className="text-lg md:text-4xl font-text font-bold text-bold text-dark-gray">
                TRAIT SHOP
              </p>
              {page !== "details" ? (
                <div className="w-max">
                  <DropDown
                    value={selectedTraitCategory}
                    selectValue={setSelectedTraitCategory}
                    values={traitCategories}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {page === "details" ? (
                <button
                  className="font-title-regular  z-10 text-lg text-dark-gray uppercase"
                  onClick={() => toggleTrait("back")}
                >
                  &#9664; Back
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          {page === "details" ? (
            <div className="grid grid-cols-2 gap-20">
              <div className="text-center lg:w-11/12 2xl:w-9/12 relative" key={selectedTrait.id}>
                <div className="aspect-square relative">
                  {" "}
                  <img
                    style={{ borderColor: theme?.color1 }}
                    className="w-full absolute h-full rounded-xl border-4 border-gray-deep"
                    src={selectedTrait.display}
                    alt="Product"
                  />
                </div>
              </div>
              <div className=" text-lg w-4/5 justify-self-end font-text py-5 px-10  bg-gray/10">
                <div className="flex flex-col justify-between gap-2 2xl:gap-5 items-center min-w-max w-1/2 mx-auto h-full">
                  <div className="w-full">
                    <p className="w-full py-1 bg-gray-100 text-center text-white">Trait name:</p>
                    <P className="text-center text-xl 2xl:text-2xl font-bold">
                      {" "}
                      {selectedTrait.name}
                    </P>
                  </div>
                  <div className="w-full">
                    <p className="w-full py-1 bg-gray-100 text-center text-white">Price:</p>
                    <P className="text-center text-xl 2xl:text-2xl font-bold">
                      {" "}
                      {selectedTrait.price} {currencyDict[selectedTrait.currencyHash]}
                    </P>
                  </div>

                  <div className="flex flex-col w-full gap-2">
                    <p className="w-full py-1 bg-gray-100 text-center text-white">Supply:</p>
                    <div
                      style={{ borderColor: `${theme?.color1}` }}
                      className="border border-gray-100 "
                    >
                      <ProgressBar
                        height="15px"
                        bgColor={theme?.color3 || "#D2523C"}
                        borderRadius="0px"
                        completed={
                          ((selectedTrait.supply - selectedTrait.amountPurchased) /
                            selectedTrait.supply) *
                          100
                        }
                        isLabelVisible={false}
                      />
                    </div>
                    <P className=" text-xl 2xl:text-2xl font-bold text-center">
                      {selectedTrait.supply - selectedTrait.amountPurchased}/{selectedTrait.supply}{" "}
                      left
                    </P>
                  </div>
                  <div className="w-full">
                    <p className="w-full py-1 bg-gray-100 text-center text-white">
                      Collection name:
                    </p>
                    <P className="text-center">{selectedTrait.description}</P>
                  </div>
                  <div className="mt-auto 2xl:mt-0">
                    {" "}
                    <BuyNowBtn
                      onClick={() => {
                        purchaseTrait(selectedTrait);
                      }}
                      disabled={!publicKey}
                      className="purchase-big  disabled:opacity-50 font-title-regular px-6 py-3 text-3xl bg-primary-red transition-all hover:translate-y-[calc(50%-6px)] text-white rounded-full uppercase shadow-lg relative top-4 translate-y-1/2"
                    >
                      <span className="relative top-0.5"> {"PURCHASE"}</span>
                    </BuyNowBtn>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-10 h-full">
              {allTraits
                .filter((item) =>
                  selectedTraitCategory !== "All Traits"
                    ? item.type === selectedTraitCategory
                    : true
                )
                .map((item, index) => (
                  <TraitItem
                    key={`${item.name}_${item.price}_${item.currencyHash}_${index}`}
                    item={item}
                    currencyDict={currencyDict}
                    publicKey={publicKey}
                    toggleItem={toggleTrait}
                    purchaseTrait={purchaseTrait}
                    theme={theme}
                    allowed={allowed}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Traits;
