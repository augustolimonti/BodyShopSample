import React from "react";
// import { Link } from "react-router-dom";
import { NavItem } from "./UI/StyledComponents";
import Logo from "../img/initial_image.png";

const SideBarNew = (props) => {

  let tabs = [
    { label: "shop", tabName: "traitShop", bg: "bg-primary-red" },
    { label: "customizer", tabName: "customize", bg: "bg-primary-red-tint" },
  ];


  return (
    <nav className="h-full flex flex-col items-center justify-center">
      <ul className="flex flex-col items-center justify-center h-full flex-grow gap-5">
        {tabs.map((tab) => (
          <NavItem
            onClick={() => {
              props.setPage(tab.tabName);
              props?.closeMenu();
            }}
            key={`${tab.tabName}_${tab.label}`}
            className={`px-6 sm:px-8 text-xs sm:text-base cursor-pointer sm:text-black lowercase font-lekton text-white ${
              tab.tabName === props?.page ? "current" : ""
            }`}
          >
            {tab.label}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
};
export default SideBarNew;
