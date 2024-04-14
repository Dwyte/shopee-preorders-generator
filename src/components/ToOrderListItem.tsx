import { useEffect, useState } from "react";

interface Props {
  supplierCode: string;
  toOrderListItem: any;
}

const ToOrderListItem = ({ supplierCode, toOrderListItem }: Props) => {
  const [productsToOrder, setProductsToOrder] = useState<string>("");
  useEffect(() => {
    setProductsToOrder(() => {
      let temporaryValue = "";
      for (let productName in toOrderListItem) {
        temporaryValue +=
          productName.match(/^[a-zA-Z0-9\s-]+/)?.[0].toUpperCase() + "\n";
        for (let variation in toOrderListItem[productName]) {
          temporaryValue +=
            toOrderListItem[productName][variation] + " " + variation + "\n";
        }
        temporaryValue += "\n";
      }
      return temporaryValue;
    });
  }, []);

  return (
    <div>
      <br />
      {supplierCode} <br />
      <textarea id="" cols={75} rows={25} value={productsToOrder} readOnly />
    </div>
  );
};

export default ToOrderListItem;
