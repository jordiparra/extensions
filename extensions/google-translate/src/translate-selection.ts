import { getSelectedText } from "@raycast/api";
import translate from "@vitalets/google-translate-api";
import { LanguageCode } from "./languages";

// Define a constant to represent the auto-detect language option
export const AUTO_DETECT = "auto";

// Define the type for the translation result object
export type TranslateSelection = {
  selectedText: string;
  translatedText: string;
  pronunciation: string;
  langFrom: LanguageCode;
  langTo: LanguageCode;
};

// Define the main function for performing the translation
export async function simpleTranslate(
  options: { langFrom: LanguageCode; langTo: LanguageCode }
): Promise<TranslateSelection> {
  // Get the selected text from the foreground application
  const selectedText = await getSelectedText().catch(() => "");

  // Set the input text to the selected text, or an empty string if nothing was selected
  const inputText = selectedText || "";

  // Determine if the source language is set to auto-detect
  const isAutoDetect = options.langFrom === AUTO_DETECT;

  // Perform the translation using the input text and the translation options
  const translated = await translate(inputText, {
    from: isAutoDetect ? undefined : options.langFrom,
    to: options.langTo,
  });

  // Construct the translation result object with the selected text, translated text,
  // pronunciation, source language, and target language
  const translationResult: TranslateSelection = {
    selectedText: inputText,
    translatedText: translated.text,
    pronunciation: translated.pronunciation,
    langFrom: isAutoDetect ? (translated?.from?.language?.iso as LanguageCode) : options.langFrom,
    langTo: options.langTo,
  };

  // Return the translation result object
  return translationResult;
}
