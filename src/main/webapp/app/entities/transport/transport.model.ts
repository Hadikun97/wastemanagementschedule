import { Types } from 'app/entities/enumerations/types.model';

export interface ITransport {
  id: number;
  transportNo?: string | null;
  regsNo?: string | null;
  type?: Types | null;
}

export type NewTransport = Omit<ITransport, 'id'> & { id: null };
