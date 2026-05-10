export type ModifierRow = {
  id: string;
  label: string;
  value: string;
};

export type Drink = {
  id: string;
  name: string;
  rows: ModifierRow[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type Store = {
  drinks: Drink[];
  schemaVersion: 1;
};

export const STORAGE_KEY = "drink-card.store.v1";
