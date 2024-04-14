interface Props {
  supplierCode: string;
  productsToOrderText: string;
}

const ToOrderListItem = ({ supplierCode, productsToOrderText }: Props) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(productsToOrderText);
  };

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
