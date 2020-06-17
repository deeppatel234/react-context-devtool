import React from "react";

import { SideBarWrapper, SideBarItem, SideBarTitle } from "./styled";

const SideBar = ({ contextList, selectedContext, onChangeSelectedContext }) => {

  const onClickItem = event => {
    const { value } = event.target.dataset;
    onChangeSelectedContext(value);
  };

  return (
    <SideBarWrapper>
      <SideBarTitle>
        Context List
      </SideBarTitle>
      {contextList.map(({ value, displayName }) => (
        <SideBarItem
          key={value}
          data-value={value}
          isSelected={value === selectedContext}
          onClick={onClickItem}
        >
          {displayName}
        </SideBarItem>
      ))}
    </SideBarWrapper>
  );
};

export default SideBar;
