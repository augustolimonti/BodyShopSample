import React from "react";
import { useTheme } from "styled-components";

export default function SemiCricle() {
  const theme = useTheme();
  return (
    <div className="relative h-full w-full overflow-x-hidden pl-12 ">
      <div className=" h-full aspect-square relative">
        <div
          style={{ backgroundColor: theme?.color3 }}
          className="absolute w-full h-full rounded-full bg-red-deep"
        />
        <div className=" w-max absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-3">
          <div style={{ backgroundColor: theme?.color1 }} className="w-6 h-6 rounded-full" />
          <div style={{ backgroundColor: theme?.color1 }} className="w-6 h-6 rounded-full" />
          <div style={{ backgroundColor: theme?.color1 }} className="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
