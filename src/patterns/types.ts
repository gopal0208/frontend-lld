import { ReactNode } from 'react';

export interface LLDPattern {
  id: string;
  title: string;
  description: string;
  frameworks?: string[];
  diagram: string;
  theory: {
    intent: string;
    whenToUse: string[];
    prosAndCons: {
      pros: string[];
      cons: string[];
    };
  };
  codeFiles: {
    filename: string;
    code: string;
    language: string;
  }[];
}
