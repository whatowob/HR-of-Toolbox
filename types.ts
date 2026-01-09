
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  members: Participant[];
}

export type Tab = 'list' | 'raffle' | 'grouping';
