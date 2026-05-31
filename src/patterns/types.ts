import { ReactNode } from 'react';

export interface LLDPattern {
  id: string;
  title: string;
  description: string;
  diagram: string;
  theory: {
    intent: string;
    whenToUse: string[];
    prosAndCons: {
      pros: string[];
      cons: string[];
    };
  };
  demoComponent: ReactNode;
  codeFiles: {
    filename: string;
    code: string;
    language: string;
  }[];
}
