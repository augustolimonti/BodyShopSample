import React from 'react';
import logo from '../../img/logo-svg.svg';
import Socials from './Socials';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';
import magicEden from '../../img/magicEden.svg';
export default function Footer(props) {

  return (
    <div className="px-7 py-5 pt-24 sm:pt-96 bg-[#EAE9E8]">
      <div className="md:px-10 md:flex md:justify-between mb-5 md:mb-0">
        <div className="flex flex-col items-center gap-4">
          <img className="w-20" src={logo} alt={'Powered by MAXIN'} />
          <p className="font-text text-xl font-bold text-gray-deep">POWERED BY MAXIN'</p>
          <div className="flex gap-3 items-center h-auto ">
            <a href="https://twitter.com/maxinNFT" target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt="twitter" />
            </a>
            <a href="#">
              <img src={discord} alt="discord" />
            </a>
            <a href="#">
              <img src={magicEden} alt="instagram" />
            </a>
          </div>
        </div>
        <div className="hidden md:block md:grid md:grid-cols-2 md:gap-10 md:font-text md:text-xl md:text-gray-deep md:mb-10 ">
          <div className="flex flex-col gap-5">
            <p className="font-bold uppercase ">Body Shop</p>
            <a href="https://twitter.com/maxinNFT" target="_blank" rel="noopener noreferrer">About us</a>
            <a href="https://docs.google.com/forms/d/18l5qdTbIrc2vbQh3S2T4mWAFIB_zlI8cpmKFCoZwfBM/prefill" target="_blank" rel="noopener noreferrer">Onboard Project</a>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-bold uppercase ">products</p>
            <a onClick={() => {
            }}>Trait Shop</a>
            <a onClick={() => {
            }}>Customizer</a>
            <a onClick={() => {
            }}>Builder</a>
          </div>
        </div>
      </div>
      <div className="bg-gray-100/80 sm:pt-10 sm:pb-20 font-text text-white">
        <p className="text-center">©2023 - All rights reserved by maxin'</p>
      </div>
    </div>
  );
}
