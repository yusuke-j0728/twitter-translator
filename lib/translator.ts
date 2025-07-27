import axios from 'axios';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage?: string;
}

export async function translateToEnglish(text: string): Promise<TranslationResult> {
  try {
    if (!process.env.DEEPL_API_KEY) {
      throw new Error('DeepL API key not configured');
    }

    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({
        text: text,
        target_lang: 'EN',
        auth_key: process.env.DEEPL_API_KEY
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const translation = response.data.translations[0];
    
    return {
      originalText: text,
      translatedText: translation.text,
      detectedLanguage: translation.detected_source_language
    };
  } catch (error) {
    console.error('Translation error:', error);
    
    return {
      originalText: text,
      translatedText: text,
      detectedLanguage: 'unknown'
    };
  }
}

export async function translateMultiple(texts: string[]): Promise<TranslationResult[]> {
  const results = await Promise.all(
    texts.map(text => translateToEnglish(text))
  );
  return results;
}