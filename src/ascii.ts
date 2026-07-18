/**
 * ASCII art conversion utilities
 * Converts images to ASCII using Sharp and manual grayscale conversion
 */

import sharp from 'sharp';
import * as fs from 'fs/promises';
import { config } from './config.js';

const GRAYSCALE_CHARS_UNICODE =
  ' .\u2591\u2592\u2593█';
const GRAYSCALE_CHARS_ASCII = ' .:-=+*#%@';

/**
 * Get appropriate character set based on configuration
 */
const getCharacterSet = (): string => {
  return config.asciiStyle === 'unicode' ? GRAYSCALE_CHARS_UNICODE : GRAYSCALE_CHARS_ASCII;
};

/**
 * Process image and convert to ASCII art
 */
export const imageToAscii = async (imagePath: string): Promise<string> => {
  console.log('🎨 Converting image to ASCII...');

  try {
    // Read and resize image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Could not determine image dimensions');
    }

    // Calculate resize dimensions to maintain aspect ratio
    const aspectRatio = metadata.width / metadata.height;
    const newWidth = config.asciiWidth;
    // ASCII characters are roughly 2:1 height to width ratio
    const newHeight = Math.round(newWidth / aspectRatio / 2);

    // Resize and convert to grayscale
    const buffer = await image
      .resize(newWidth, newHeight, {
        fit: 'cover',
        position: 'center',
      })
      .grayscale()
      .raw()
      .toBuffer();

    // Convert pixel data to ASCII
    const chars = getCharacterSet();
    let asciiArt = '';
    const pixelCount = newWidth * newHeight;

    for (let i = 0; i < pixelCount; i++) {
      const pixelValue = buffer[i];
      const charIndex = Math.floor((pixelValue / 255) * (chars.length - 1));
      asciiArt += chars[charIndex];

      // Add newline at end of each row
      if ((i + 1) % newWidth === 0) {
        asciiArt += '\n';
      }
    }

    console.log('✅ ASCII conversion complete');
    return asciiArt;
  } catch (error) {
    throw new Error(`Failed to convert image to ASCII: ${error}`);
  }
};

/**
 * Convert image to ASCII and save to file
 */
export const saveAsciiToFile = async (asciiArt: string, outputPath: string): Promise<void> => {
  console.log(`💾 Saving ASCII art to ${outputPath}...`);
  try {
    await fs.writeFile(outputPath, asciiArt, 'utf-8');
    console.log('✅ ASCII art saved');
  } catch (error) {
    throw new Error(`Failed to save ASCII art: ${error}`);
  }
};
