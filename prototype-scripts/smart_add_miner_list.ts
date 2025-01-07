/**
 * Feature
 * Easily drag and drop chats to input and intelligently format
 * the livenotes miner list text.
 * 
 * example.
 * 
 * Drags and dropped "nerryceledoniomine summer"
 * feature detects the code from existing ones "summer" and 
 * add the current line.
 * 
 * CODE: SUMMER
 * nerryceledoniomine summer
 * 
 * If code is not recognized (new code/ non existed)
 * Let user input the new code, and suggest based on the text
 * simply split and check the last the part. "summer"
 */

import { getLiveNotes } from "../src/api";

const getAllBundleCodes = async () => {
    const liveNotes = await getLiveNotes("Jenna");

    console.log(liveNotes)
}

  // useEffect(() => {
  //   const bundleCodes = extractBundleCodes(userLiveNotes);
  //   saveBundleCodes(currentUser, bundleCodes);

  //   const test = "marilyntalaugonmine tawi2x"
  //   for (let bundleCode of bundleCodes) {
  //     if (test.toUpperCase().includes(bundleCode)) {
  //       console.log(bundleCode)
  //       break;
  //     }
  //   }

  //   const cos = stringComparison.cosine.sortMatch(test, bundleCodes)
  //   console.log(cos.slice(-10))
  //   const dice = stringComparison.diceCoefficient.sortMatch(test, bundleCodes)
  //   console.log(dice.slice(-10))
  //   const jacc = stringComparison.jaccardIndex.sortMatch(test, bundleCodes)
  //   console.log(jacc.slice(-10))
  //   const lev = stringComparison.levenshtein.sortMatch(test, bundleCodes)
  //   console.log(lev.slice(-10))
  //   const jar = stringComparison.jaroWinkler.sortMatch(test, bundleCodes)
  //   console.log("jar", jar.slice(-10))
  //   const lcs = stringComparison.mlcs.sortMatch(test, bundleCodes)
  //   console.log("lcs", lcs.slice(-10))


  //   // const dice = stringComparison.diceCoefficient.sortMatch("mariejoyabarlemine sardines", bundleCodes)
  //   // console.log(dice.slice(-10))

  //   // const dice1 = stringComparison.diceCoefficient.sortMatch("agent.j0uiesoju", bundleCodes)
  //   // console.log(dice1.slice(-10))

  //   // const dice2 = stringComparison.diceCoefficient.sortMatch("antonettezaycozambalez", bundleCodes)
  //   // console.log(dice2.slice(-10))

  //   // const dice3 = stringComparison.diceCoefficient.sortMatch("mayannblanciaCharcol", bundleCodes)
  //   // console.log(dice3.slice(-10))


  // }, [userLiveNotes])