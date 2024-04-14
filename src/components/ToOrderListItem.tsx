import React from "react";

interface Props {
  supplierCode: string;
  toOrderListItem: any;
}

const ToOrderListItem = ({ supplierCode, toOrderListItem }: Props) => {
  return (
    <div>
      ---------------------------------
      <br />
      {supplierCode} <br />
      {Object.keys(toOrderListItem).map((productName) => (
        <>
          {productName} <br />
          {Object.keys(toOrderListItem[productName]).map((variation) => (
            <>
              {toOrderListItem[productName][variation]} {variation}
              <br />
            </>
          ))}
          <br />
        </>
      ))}
    </div>
  );
};

export default ToOrderListItem;
