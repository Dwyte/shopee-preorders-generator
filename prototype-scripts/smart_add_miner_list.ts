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