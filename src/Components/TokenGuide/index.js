import React, { Component } from "react";
import "./index.css";
import { CurrencyOptions } from "../../Utils/Constants";

const blueTokenImg = require("../../assets/images/tokens/blue-token.png");
const greenTokenImg = require("../../assets/images/tokens/green-token.png");
const pinkTokenImg = require("../../assets/images/tokens/pink-token.png");

const TokenGuide = ({ territory }) => (
  <div className="guide-token">
    <div className="guide-token-wrapper">
      <div className="guide-token-wrapper-left">
        <img src={blueTokenImg} alt="blue-token"></img>
        <p>
          1
          <br />
          token
        </p>
      </div>
      <p>=</p>
      <div
        className="guide-token-wrapper-right"
        style={{ background: "#F58B61" }}
      >
        <p>1{territory === "UK" ? "p" : "c"}</p>
      </div>
    </div>
    <div className="guide-token-wrapper">
      <div className="guide-token-wrapper-left">
        <img src={greenTokenImg} alt="green-token"></img>
        <p>
          10
          <br />
          tokens
        </p>
      </div>
      <p>=</p>
      <div
        className="guide-token-wrapper-right"
        style={{ background: "#D4DBE3" }}
      >
        <p>10{territory === "UK" ? "p" : "c"}</p>
      </div>
    </div>
    <div className="guide-token-wrapper">
      <div className="guide-token-wrapper-left">
        <img src={pinkTokenImg} alt="pink-token"></img>
        <p>
          100
          <br />
          tokens
        </p>
      </div>
      <p>=</p>
      <div
        className="guide-token-wrapper-right"
        style={{ background: "#F8DD47" }}
      >
        <p>{CurrencyOptions[territory]}1</p>
      </div>
    </div>
  </div>
);

export default TokenGuide;
