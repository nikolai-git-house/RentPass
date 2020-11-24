import React from "react";
const imageAll = require("../../../assets/images/chip.png");
const imageTop10 = require("../../../assets/images/sign.png");
const imageFood = require("../../../assets/images/dinner-table.png");
const imageBeauty = require("../../../assets/images/heart.png");
const imageFashion = require("../../../assets/images/armchair.png");
const imageHome = require("../../../assets/images/responsive.png");
const imageTech = require("../../../assets/images/ticket.png");
const imageEntertainment = require("../../../assets/images/ticket.png");
class FilterTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
    };
  }
  render() {
    const { filter_View } = this.props;
    return (
      <div className="filter_tab offer_type mb-0">
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Top 10")}
        >
          <img src={imageTop10}></img>
          <p>Top 10</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Entertainment")}
        >
          <img src={imageEntertainment}></img>
          <p>Entertainment</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Food & Drink")}
        >
          <img src={imageFood}></img>
          <p>Food & Drink</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Beauty & Wellbeing")}
        >
          <img src={imageBeauty}></img>
          <p>Beauty & Wellbeing</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Fashion")}
        >
          <img src={imageFashion}></img>
          <p>Fashion</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Home")}
        >
          <img src={imageHome}></img>
          <p>Home</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("Tech")}
        >
          <img src={imageTech}></img>
          <p>Tech</p>
        </button>
        <button
          className="btn btn-filter-with-img"
          onClick={() => filter_View("all")}
        >
          <img src={imageAll}></img>
          <p>All</p>
        </button>
      </div>
    );
  }
}

export default FilterTab;
