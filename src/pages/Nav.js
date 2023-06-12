import React, { useState, useEffect } from "react";
import axios from "axios";

import SideBarNew from "../components/SideBarNew";
import Logo from "../img/initial_image.png";
import menuIcon from "../img/burger-menu.svg";
import twitter from "../img/twitter.svg";
import discord from "../img/discord.svg";
import magicEden from "../img/magicEden.svg";
import Traits from "./Traits";
import Customize from "./Customize";
import Footer from "../components/UI/Footer";
import Socials from "../components/UI/Socials";
import Stats from "../components/UI/Stats";

const Nav = ({ children, ...props }) => {
  let initalPage = "traitShop";

  const [page, setPage] = useState(initalPage);
  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = (val) => {
    setShowMenu(val || !showMenu);
  };

  const renderPage = () => {
    return (
      <section id="nav-section" className=" min-h-screen grid sm:grid-cols-[max-content,1fr]   ">
        <div
          className={`fixed  z-20 right-0 h-screen sm:sticky top-0 bg-gray-deep/90 sm:bg-transparent transition-all ${
            showMenu ? "" : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
          }`}
        >
          <SideBarNew
            setPage={setPage}
            closeMenu={() => {
              handleShowMenu(false);
            }}
            page={page}
            fusions={props.fusions}
            mutations={props.mutations}
            slotMachine={props.slotMachine}
            projectID={props.projectID}
          />
        </div>
        <div className="flex flex-col h-full flex-grow">
          <div className="">
            <div className="top-0 right-0 fixed sm:relative z-30 w-full">
              <div className="header ml-auto self-end flex justify-between items-center sm:items-end sm:w-full pl-5 pr-10  sm:px-7 relative ">
                <div className=" h-full">
                  <div className="h-full flex-cols items-center justify-start">
                    <div className="flex items-center justify-left h-1/3">
                      <p className="sm:text-3xl text-lg font-logo text-white-off">THE</p>
                    </div>
                    <div className="flex items-center justify-left h-1/3">
                      <p className="sm:text-3xl text-lg font-logo text-white-off">MAXIN'</p>
                    </div>
                    <div className="flex items-center justify-left h-1/3">
                      <p className="sm:text-3xl text-lg font-logo text-white-off">BODY SHOP</p>
                    </div>

                  </div>
                </div>
                <div onClick={handleShowMenu} className="sm:hidden h-auto">
                  <img className=" cursor-pointer" src={menuIcon} alt="menu button" />
                </div>
                <div className="hidden h-full sm:flex flex-col justify-center gap-5 py-5">
                  {children}
                </div>
              </div>
            </div>
            <div className="py-2 px-0 sm:px-7 flex pt-16 sm:pt-2 sm:h-36 w-full justify-between  bg-[#EAE9E8]">
              <div className="hidden sm:flex gap-3 items-center opacity-0 pointer-events-none">
                <img src={twitter} alt="twitter" />
                <img src={discord} alt="discord" />
                <img src={magicEden} alt="magicEden" />
              </div>
              <div className="grid grid-cols-[1fr,max-content] sm:flex sm:flex-col justify-center h-full gap-1 items-center sm:py-1">
                <img
                  className={`block sm:pl-0 w-4/5 mx-auto ${props.projectID === 1 ? '' : 'rounded-full'} hover:cursor-pointer sm:h-1/2 w-auto flex-grow  object-contain`}
                  src={props.projectLogo}
                  alt="Logo"
                />

                <div className="w-full pr-4 flex-cols sm:hidden">
                  <div className='pb-2 flex justify-end items-center'>
                    {children}
                  </div>
                  <Stats projectID={props.projectID}/>
                </div>
                <p className=" text-center bg-dark-gray sm:bg-dark-gray pl-6 pr-6 pt-1 pb-1 text-white sm:text-gray-light flex-shrink-0 uppercase ">
                  {props.projectTitle}
                </p>
                <div className="sm:hidden h-full flex items-center  py-1 px-2 bg-gray-400/10">
                  <Socials twitterHandle={props.twitterHandle} discordURL={props.discordURL} magicEdenURL = {props.magicEdenURL}/>
                </div>
              </div>
              <div className="hidden sm:block">
                <Socials twitterHandle={props.twitterHandle} discordURL={props.discordURL} magicEdenURL = {props.magicEdenURL}/>
              </div>
            </div>
          </div>
          <div className="bg-[#EAE9E8] sm:px-7  h-full">
            {page.includes("traitShop") && (
              <Traits
                projectName={props.projectName}
                projectHashURL={props.projectHashURL}
                projectLink={props.projectLink}
                projectID={props.projectID}
                setPage={setPage}
                projectCreator={props.projectCreator}
                projectLogo={props.projectLogo}
                hasReferral={props.hasReferral}
                referralWallet={props.referralWallet}
                referralPercentage={props.referralPercentage}
              />
            )}
            {page.includes("customize") && (
              <Customize
                projectName={props.projectName}
                projectHashURL={props.projectHashURL}
                projectLink={props.projectLink}
                projectID={props.projectID}
                projectLogo={props.projectLogo}
                setPage={setPage}
                projectTraitCollectionHash={props.projectTraitCollectionHash}
                swapTraits={props.swapTraits}
                hasReferral={props.hasReferral}
                referralWallet={props.referralWallet}
                referralPercentage={props.referralPercentage}
              />
            )}
          </div>
          <Footer setPage={setPage}/>
        </div>
      </section>
    );
  };

  return <div>{renderPage()}</div>;
};

export default Nav;
