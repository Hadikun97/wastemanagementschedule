import { License } from 'app/entities/enumerations/license.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IStaff {
  id: number;
  regNo?: string | null;
  license?: License | null;
  gender?: Gender | null;
  name?: string | null;
  address?: string | null;
  contactNo?: string | null;
}

export type NewStaff = Omit<IStaff, 'id'> & { id: null };
