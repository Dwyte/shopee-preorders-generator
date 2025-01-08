/**
tfhl3uwkw3midnight
che431mine midnight
ronie_t... and other 13 viewers joined!
nicolep... is buying products!
kristin... is buying products!
evangelinabellenmine bikol
__nana___Mine tiger
tres11 and other 15 viewers joined!
nicolequijanogabrielmine tiger

lloydtrinoma tiwtatwia
ronierepaldatwnstr
myrasolastorgatnsar
regie123midniht
kjdbjqwebflewqk pinas
djkhfere twinstar
312h51nrwqkr twin star


gwjjfqjh columbia
f1we18204mine clumbia

fiwbfefdqk btc
81kndnfowfbitcoin
fuh3or1dnbitcoin
     */

import { LiveNotes } from "../../types";


export enum LiveNotesState {
  Initial,
  Loading,
  Done,
}

export const liveNotesTextAreaPlaceholder = `Use the following format:
CODE: <Enter Code Here> (Space after "CODE:" is important)
<miner/buyer 1>        
<miner/buyer 2>        
<miner/buyer 3>

CODE: <Enter Code Here>
<miner/buyer 1>       
<miner/buyer 2>    

CODE: <Enter Code Here>
<miner/buyer 1>

(Click NEW CODE-MINERS TEMPLATE to autofill the following format)
`;

export const newLiveNoteTemplate: LiveNotes = {
  id: "",
  user: "",
  liveNotes: "",
  datetime: -1,
};

export const codeMinersListTemplate = {
  codePrefix: "CODE:",
  spacesAfterCode: "\n\n\n\n\n\n",
  listFooter: "- - - - - - - - - - - - - - -",
};

type MinersListJSON = { [key: string]: Set<string> };

export const parseMinersListText = (minersListText: string): MinersListJSON => {
  let minersListJSON: MinersListJSON = {};
  let minersListTextLines = minersListText.split("\n");
  let currentCode = null;
  for (let line of minersListTextLines) {
    if (line.startsWith("CODE:")) {
      currentCode = line.replace("CODE:", "").trim().toUpperCase();
      console.log(currentCode);
      // Check if empty string
      if (currentCode) {
        minersListJSON[currentCode] = new Set([]);
      } else {
        currentCode = null;
      }

      continue;
    }

    // push miner to current code list
    if (
      currentCode &&
      line &&
      line.trim() !== codeMinersListTemplate.listFooter
    ) {
      minersListJSON[currentCode].add(line);
    }
  }

  return minersListJSON;
};

export const stringifyMinersListJSON = (minersListJSON: MinersListJSON) => {
  let newMinersListTextArray = [];
  for (let code in minersListJSON) {
    newMinersListTextArray.push(`CODE: ${code}`);

    for (let miner of minersListJSON[code]) {
      newMinersListTextArray.push(miner);
    }

    newMinersListTextArray.push("\n");
    newMinersListTextArray.push(codeMinersListTemplate.listFooter);
  }

  return newMinersListTextArray.join("\n") + "\n";
};
