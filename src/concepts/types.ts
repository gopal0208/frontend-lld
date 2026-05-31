import { ReactNode } from 'react';

export interface LLDConcept {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  frameworks?: string[];
  media?: {
    type: 'youtube' | 'local' | 'none';
    url: string;
    thumbnail?: string;
  };
  diagram?: string; // Mermaid markdown or text diagram
  theory: {
    problemStatement: string;
    coreChallenges: string[];
    designPatterns: string[];
    keyTakeaways: string[];
  };
  codeFiles: {
    filename: string;
    code: string;
    language: string;
  }[];
}
