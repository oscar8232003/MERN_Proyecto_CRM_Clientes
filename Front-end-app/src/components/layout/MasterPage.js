import React from "react";
import Header from "./Header";

const MasterPage = ({ children }) => {
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
};

export default MasterPage;
