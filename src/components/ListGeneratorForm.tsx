import { useState } from "react";
import { generateListFromFiles } from "../scripts";
import { GeneratedList } from "../types";

const ListGeneratorForm = ({
  handleSubmit,
}: {
  handleSubmit: (a: GeneratedList) => void;
}) => {
  const [daysToShipFile, setDaysToShipFile] = useState<File | null>(null);
  const [bigSellerOrdersFile, setBigSellerOrdersFile] = useState<File | null>(
    null
  );

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setter(file);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (daysToShipFile !== null && bigSellerOrdersFile !== null) {
      const generatedList = await generateListFromFiles(
        daysToShipFile,
        bigSellerOrdersFile
      );

      handleSubmit(generatedList);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <br />
      <label htmlFor="dtsFileInput">Days to Ship File</label> <br />
      <input
        id="dtsFileInput"
        type="file"
        onChange={(event) => handleFileChange(event, setDaysToShipFile)}
      />
      <br />
      <br />
      <label htmlFor="ordersFileInput">BigSeller Orders File</label> <br />
      <input
        id="ordersFileInput"
        type="file"
        onChange={(event) => handleFileChange(event, setBigSellerOrdersFile)}
      />
      <br />
      <br />
      <input type="submit" />
      <br />
    </form>
  );
};

export default ListGeneratorForm;
