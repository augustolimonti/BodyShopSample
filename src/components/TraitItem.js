import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import { BuyNowBtn, InfoBtn } from "./UI/StyledComponents";
export default function TraitItem({
  item,
  currencyDict,
  publicKey,
  toggleItem,
  purchaseTrait,
  theme,
  allowed,
}) {
  const { connection } = useConnection();

  return (
    <div
      className={`relative  p-5 h-[max-content] bg-white  cursor-pointer shadow-sm hover:shadow-lg  transition ease-in-out  duration-300  ${
        item.soldOut ? "grayscale" : ""
      }`}
    >
      <div className="w-full pb-[100%] rounded-lg relative overflow-hidden">
        <img
          className="w-full h-full absolute object-contain "
          src={item.display}
          style={{ borderRadius: 10 }}
          alt="Product"
        />
      </div>
      <div className="grid grid-cols-[1fr,max-content] gap-2 mb-5 w-full font-text font-bold text-[14px] lg:text-xl 2xl:text-3xl">
        <div
          className={
            "text-left py-2 text-gray uppercase   text-ellipsis whitespace-nowrap overflow-hidden"
          }
        >
          {item.name}
        </div>
        <div className={"text-right py-2 text-gray uppercase  "}>
          {item.price} {currencyDict[item.currencyHash]}
        </div>
      </div>
      <div className="mb-4">
        <div
          style={{ borderColor: `${theme?.color1}` }}
          className="border border-gray-deep h-1.5 xl:h-4 "
        >
          <ProgressBar
            height="100%"
            bgColor={theme?.color3 || "#43825C"}
            borderRadius="0px"
            completed={((item.supply - item.amountPurchased) / item.supply) * 100}
            isLabelVisible={false}
          />
        </div>
        <div className="font-text font-bold px-1 py-1 text-[14px] lg:text-xl 2xl:text-2xl text-gray">
          SUPPLY: {item.supply - item.amountPurchased}/{item.supply}
        </div>
      </div>

      <div className={`grid gap-2 ${item.soldOut ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2 "}`}>
        {item.soldOut ? (
          <button
            disabled={item.soldOut}
            className={
              "disabled:opacity-50 font-text font-semibold px-1 py-1 text-sm lg:text-xl 2xl:text-2xl bg-primary-red text-white rounded-full uppercase shadow-lg ml-1 mr-1"
            }
          >
            SOLD OUT
          </button>
        ) : (
          <>
            {item.nftRequirementHash && publicKey ? (
              <>
                {allowed ? (
                  <>
                    <BuyNowBtn
                      onClick={() => {
                        purchaseTrait(item);
                      }}
                      disabled={!publicKey || !allowed}
                      className="disabled:opacity-50 font-text font-semibold px-1 py-1 text-sm xl:text-xl bg-primary-red hover:opacity-50 text-white rounded-full uppercase shadow-lg ml-1 mr-1"
                    >
                      Buy Now
                    </BuyNowBtn>
                    <InfoBtn
                      title={item.description}
                      disabled={!publicKey}
                      className="hidden xl:block disabled:opacity-50 font-text font-semibold px-1 py-1 text-sm xl:text-xl bg-dark-gray text-white rounded-full uppercase shadow-lg hover:opacity-50"
                      onClick={() => toggleItem(item)}
                    >
                      {" "}
                      +INFO{" "}
                    </InfoBtn>
                  </>
                ) : (
                  <div
                    className={
                      "text-left text-gray-deep uppercase font-gilroy-bold text-[8px] xl:text-[14px] text-ellipsis whitespace-nowrap overflow-hidden"
                    }
                  >
                    Not Available
                  </div>
                )}
              </>
            ) : (
              <>
                <BuyNowBtn
                  onClick={() => {
                    purchaseTrait(item);
                  }}
                  disabled={!publicKey}
                  className="disabled:opacity-50 font-text font-semibold px-1 py-1 text-sm xl:text-xl bg-primary-red hover:opacity-50 text-white rounded-full uppercase shadow-lg ml-1 mr-1"
                >
                  Buy Now
                </BuyNowBtn>
                <InfoBtn
                  title={item.description}
                  disabled={!publicKey}
                  className=" hidden xl:block disabled:opacity-50 font-text font-semibold px-1 py-1 text-sm xl:text-xl bg-dark-gray text-white rounded-full uppercase shadow-lg hover:opacity-50"
                  onClick={() => toggleItem(item)}
                >
                  {" "}
                  +INFO{" "}
                </InfoBtn>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
