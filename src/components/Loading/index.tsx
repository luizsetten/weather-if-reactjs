import React from "react";
import "./styles.css";

function Loading() {
  return (
    <>
      <h1>Carregando</h1>
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </>
  );
}

export default Loading;
