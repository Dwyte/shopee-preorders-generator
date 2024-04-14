import { useEffect, useState } from "react";

interface Props {
  supplierCode: string;
  toOrderListItem: any;
}

const ToOrderListItem = ({ supplierCode, toOrderListItem }: Props) => {
  const [productsToOrderText, setProductsToOrderText] = useState<string>("");

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(productsToOrderText);
  };

  useEffect(() => {
    setProductsToOrderText(() => {
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
      {supplierCode}{" "}
      <button onClick={handleCopyToClipboard}> Copy to Clipboard </button>{" "}
      <br />
      <textarea
        id=""
        cols={75}
        rows={25}
        value={productsToOrderText}
        readOnly
      />
    </div>
  );
};

export default ToOrderListItem;
