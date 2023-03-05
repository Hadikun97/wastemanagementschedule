export interface IBulletin {
  id: number;
  title?: string | null;
  description?: string | null;
  name?: string | null;
  contactNo?: string | null;
}

export type NewBulletin = Omit<IBulletin, 'id'> & { id: null };
