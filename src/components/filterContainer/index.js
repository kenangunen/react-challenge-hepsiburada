import React, { useContext, useEffect } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import { FilteredDataContext } from "../../contexts/FilteredDataContext";
import { SortOptionsContext } from "../../contexts/SortOptionsContext";

import { getFieldUniqueValue, getFilteredData } from "../../utils/filterData";
import "./index.scss";

function FilterContainer() {
  const products = useContext(ProductContext);
  const { setFilteredData } = useContext(FilteredDataContext);
  const { sortOptions, setSortOptions } = useContext(SortOptionsContext);

  let brandList = [];
  let colorList = [];

  //fill the brandList and colorList
  products.map((product) => {
    const { brand, color } = product;
    brandList.push(brand);
    colorList.push(color);
  });

  //get uniqu poductlist base on brandList and colorList. Required for filter options.
  const uniqueList = getFieldUniqueValue({ brandList, colorList });
  const { uniqueBrandsWithCount, uniqueColorsWithCount } = uniqueList;

  //works when clicking on filters
  const setFilter = (e, filterType, filterKey) => {
    //all active class remove
    const activeOptionElement = [...document.getElementsByClassName("active")];
    activeOptionElement[0]?.classList.remove("active");

    //add active class to selected option.
    const selectedOptionElement = e.target;
    selectedOptionElement.classList.add("active");

    //get filteredData base on filterType and filterKey
    const data = getFilteredData(products, filterType, filterKey);
    setFilteredData(data);

    if (filterType === "sortFilter") {
      const items = [...sortOptions];

      //deactivate all selections.
      const activedItemIndex = items.findIndex((item) => item.active);
      if (activedItemIndex > -1) {
        items[activedItemIndex].active = false;
      }

      //set selected sort option for checkbox.
      const index = items.findIndex((option) => option.key === filterKey);
      items[index].active = true;
      setSortOptions(items);
    }
  };

  //works when selected from select box
  useEffect(()=>{
    const option = sortOptions.filter(option => option.active);  

    if(option.length > 0){
    //all active class remove
    const activeElement = [...document.getElementsByClassName("active")];
    activeElement[0]?.classList.remove("active");

    //add active class to selected option.
    const activeOptionElement = document.getElementById(option[0].key);
    activeOptionElement.classList.add("active");
    }
   
  },[sortOptions])

  return (
    <>
      <div className="option-container">
        <h3 className="filter-header">Renk</h3>
        <div className="options">
          {uniqueColorsWithCount.map((color, index) => {
            return (
              <li
                key={index}
                onClick={(e) => setFilter(e, "colorFilter", color.color)}
              >
                {color.color} ({color.count})
              </li>
            );
          })}
        </div>
      </div>
      <div className="option-container">
        <h3 className="filter-header">Sıralama</h3>
        <div className="options">
          {sortOptions.map((option, index) => {
            return (
              <li
                id={option.key}
                key={index}
                onClick={(e) => setFilter(e, "sortFilter", option.key)}
              >
                {option.text}
              </li>
            );
          })}
        </div>
      </div>
      <div className="option-container">
        <h3 className="filter-header">Marka</h3>
        <div className="options">
          {uniqueBrandsWithCount.map((brand, index) => {
            return (
              <li
                key={index}
                onClick={(e) => setFilter(e, "brandFilter", brand.brand)}
              >
                {brand.brand} ({brand.count})
              </li>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FilterContainer;