import React from 'react';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';
import instagram from '../../img/magicEden.svg';
export default function Socials(props) {
  console.log(props)
  return (
    <div className="flex gap-3 items-center h-auto ">
      <a href={props.twitterHandle} target="_blank" rel="noopener noreferrer">
        <img src={twitter} alt="twitter" />
      </a>
      <a href={props.discordURL} target="_blank" rel="noopener noreferrer">
        <img src={discord} alt="discord" />
      </a>
      <a href={props.magicEdenURL} target="_blank" rel="noopener noreferrer">
        <img src={instagram} alt="instagram" />
      </a>
    </div>
  );
}
