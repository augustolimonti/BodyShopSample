import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Stats(props) {

  const [totalSold, setTotalSold] = useState()
  const [availableTraits, setAvailableTraits] = useState()
  const [totalUpgraded, setTotalUpgraded] = useState()

  useEffect(() => {
    var data = JSON.stringify({
      projectID: props.projectID,
      action: "getStats",
    });

    var config = {
      method: "post",
      url: "https://rmbl36wkd5.execute-api.us-east-1.amazonaws.com/Production/getlivetraits",
      headers: {
        "x-api-key": process.env.GATEWAY_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response)
        setTotalSold(response.data.totalSales)
        setAvailableTraits(response.data.availableTraits)
        setTotalUpgraded(response.data.upgradedTotal)
      })
      .catch(function (error) {
        // console.log(error);
      });

  }, []);

  return (
    <div className="grid grid-cols-3 gap-x-1.5 gap-y-1 w-full font-text font-bold text-center uppercase">
      <p className="text-[8px] ">Available Traits</p>
      <p className="text-[8px]  ">TOTAL TRAITS SOLD</p>
      <p className="text-[8px]  ">TOTAL UPGRADES</p>
      <div className="w-full bg-gray-400/10 flex justify-center py-3 ">{availableTraits}</div>
      <div className="w-full bg-gray-400/10 flex justify-center py-3 ">{totalSold}</div>
      <div className="w-full bg-gray-400/10 flex justify-center py-3 ">{totalUpgraded}</div>
    </div>
  );
}
