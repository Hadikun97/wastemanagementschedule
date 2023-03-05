export interface IUwaste {
  id: number;
  description?: string | null;
  name?: string | null;
  contactNo?: string | null;
  address?: string | null;
}

export type NewUwaste = Omit<IUwaste, 'id'> & { id: null };
