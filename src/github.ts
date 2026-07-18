/**
 * GitHub API utilities for fetching user data, repositories, and statistics
 */

import { Octokit } from 'octokit';
import axios from 'axios';
import { GitHubUser, GitHubRepository, UserStats } from './types.js';
import { config } from './config.js';

const octokit = new Octokit({
  auth: config.githubToken,
});

/**
 * Fetch GitHub user profile data
 */
export const fetchUserProfile = async (): Promise<GitHubUser> => {
  console.log(`📊 Fetching GitHub profile for ${config.githubUsername}...`);
  try {
    const response = await octokit.rest.users.getByUsername({
      username: config.githubUsername,
    });
    return response.data as GitHubUser;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user profile: ${error}`);
  }
};

/**
 * Fetch user repositories
 */
export const fetchRepositories = async (): Promise<GitHubRepository[]> => {
  console.log('📚 Fetching repositories...');
  try {
    const response = await octokit.rest.repos.listForUser({
      username: config.githubUsername,
      sort: 'updated',
      per_page: 100,
    });
    return response.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,
      topics: repo.topics || [],
      pushed_at: repo.pushed_at || '',
      homepage: repo.homepage,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error}`);
  }
};

/**
 * Fetch pinned repositories
 */
export const fetchPinnedRepositories = async (): Promise<GitHubRepository[]> => {
  console.log('📌 Fetching pinned repositories...');
  try {
    // GitHub GraphQL query to fetch pinned repositories
    const query = `
      query {
        user(login: "${config.githubUsername}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                primaryLanguage {
                  name
                }
                stargazerCount
                forkCount
                watchers {
                  totalCount
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                pushedAt
                homepageUrl
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${config.githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      console.warn('⚠️  Could not fetch pinned repositories, using recent repos instead');
      return [];
    }

    const pinnedItems = response.data.data?.user?.pinnedItems?.nodes || [];
    return pinnedItems.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      language: repo.primaryLanguage?.name || null,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      watchers_count: repo.watchers?.totalCount || 0,
      topics: repo.repositoryTopics?.nodes?.map((t: any) => t.topic.name) || [],
      pushed_at: repo.pushedAt,
      homepage: repo.homepageUrl,
    }));
  } catch (error) {
    console.warn('⚠️  Failed to fetch pinned repositories:', error);
    return [];
  }
};

/**
 * Calculate user statistics
 */
export const calculateUserStats = (user: GitHubUser): UserStats => {
  return {
    totalRepositories: user.public_repos,
    totalStars: 0, // Will be calculated from repositories
    followers: user.followers,
    following: user.following,
    publicGists: user.public_gists,
  };
};

/**
 * Calculate total stars across all repositories
 */
export const calculateTotalStars = (repos: GitHubRepository[]): number => {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
};

/**
 * Get top languages from repositories
 */
export const getTopLanguages = (
  repos: GitHubRepository[],
  limit: number = 10
): { language: string; count: number }[] => {
  const languageMap = new Map<string, number>();

  repos.forEach((repo) => {
    if (repo.language) {
      languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
    }
  });

  return Array.from(languageMap.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Download user avatar
 */
export const downloadAvatar = async (avatarUrl: string, outputPath: string): Promise<void> => {
  console.log('🖼️  Downloading avatar...');
  try {
    const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
    const fs = await import('fs').then((m) => m.promises);
    await fs.writeFile(outputPath, response.data);
    console.log(`✅ Avatar saved to ${outputPath}`);
  } catch (error) {
    throw new Error(`Failed to download avatar: ${error}`);
  }
};
