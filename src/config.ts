/**
 * Configuration management for the GitHub Profile README Generator
 * Loads environment variables and validates required configuration
 */

import 'dotenv/config';
import { GeneratorConfig } from './types.js';

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return num;
};

const loadConfig = (): GeneratorConfig => {
  return {
    githubUsername: getEnvVar('GITHUB_USERNAME'),
    githubToken: getEnvVar('GITHUB_TOKEN'),
    profileName: getEnvVar('PROFILE_NAME', 'Developer'),
    profileRole: getEnvVar('PROFILE_ROLE', 'Full-Stack Developer'),
    profileLocation: getEnvVar('PROFILE_LOCATION', ''),
    profileBio: getEnvVar('PROFILE_BIO', ''),
    linkedinUrl: process.env.LINKEDIN_URL,
    portfolioUrl: process.env.PORTFOLIO_URL,
    email: process.env.EMAIL,
    leetcodeUsername: process.env.LEETCODE_USERNAME,
    gfgUsername: process.env.GFG_USERNAME,
    codeforcesUsername: process.env.CODEFORCES_USERNAME,
    codechefUsername: process.env.CODECHEF_USERNAME,
    asciiWidth: getEnvNumber('ASCII_WIDTH', 80),
    asciiHeight: getEnvNumber('ASCII_HEIGHT', 40),
    asciiStyle: (process.env.ASCII_STYLE || 'unicode') as 'unicode' | 'ascii',
  };
};

export const config = loadConfig();
export default config;
