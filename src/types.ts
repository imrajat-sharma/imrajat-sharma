/**
 * Core type definitions for the GitHub Profile README Generator
 */

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  pushed_at: string;
  homepage: string | null;
}

export interface UserStats {
  totalRepositories: number;
  totalStars: number;
  followers: number;
  following: number;
  publicGists: number;
}

export interface CodingProfileStats {
  leetcode?: LeetCodeStats;
  geeksforgeeks?: GFGStats;
}

export interface LeetCodeStats {
  solved: number;
  totalQuestions: number;
  rating?: number;
  ranking?: number;
}

export interface GFGStats {
  solved: number;
  score?: number;
}

export interface GeneratorConfig {
  githubUsername: string;
  githubToken: string;
  profileName: string;
  profileRole: string;
  profileLocation: string;
  profileBio: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  email?: string;
  leetcodeUsername?: string;
  gfgUsername?: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  asciiWidth: number;
  asciiHeight: number;
  asciiStyle: 'unicode' | 'ascii';
}

export interface ReadmeContent {
  header: string;
  ascii: string;
  about: string;
  techStack: string;
  stats: string;
  currentProjects: string;
  codingProfiles: string;
  contact: string;
}
