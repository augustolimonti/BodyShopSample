import React from "react";

export default function TraitsHeader({ traitCategories = [], selectedTraitCategory, setSelectedTrait, setSelectedTraitCategory, setReadyToUpgrade, setPage, position, projectID, customizer}) {

  const categoryArray = ["All Traits", ...traitCategories]


  const changeTraitCategory = (category) => {
    setSelectedTrait(0)
    setSelectedTraitCategory(category)
    if (customizer) {
      setReadyToUpgrade(false)
    }
    setPage && setPage("bodyshop")
  };

  return (
    <ul
      className={`flex  text-center   gap-5  lg:gap-x-10  ${
        ["side"].includes(position) ? "flex-col" : ""
      }`}
    >
      {categoryArray.map((cat) => (
        <li
          key={cat}
          className={`hover:cursor-pointer ${
            selectedTraitCategory === cat ? "font-title-bold" : "font-title-regular"
          }  ${(projectID === 40 || projectID === 41) ? "text-sm text-white uppercase" : "text-sm text-dark-gray uppercase"}`}
          onClick={() => changeTraitCategory(cat)}
        >
          {cat}
        </li>
      ))}
    </ul>
  );
}
