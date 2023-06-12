import React, { useEffect } from "react";

export default function Backdrop({ show = false, children, closeModal }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);
  return (
    <div
      onClick={
        closeModal ||
        (() => {
          console.log("");
        })
      }
      className="Backdrop overlay flex justify-center items-center p-10 overflow-hidden"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" max-h-full   relative overflow-hidden"
      >
        {closeModal ? (
          <div className="absolute right-2 top-2  cursor-pointer" onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          ""
        )}
        {children}
      </div>
    </div>
  );
}
