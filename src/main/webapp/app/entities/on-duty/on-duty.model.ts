import { IStaff } from 'app/entities/staff/staff.model';
import { ITransport } from 'app/entities/transport/transport.model';

export interface IOnDuty {
  id: number;
  dutyNo?: string | null;
  staff?: Pick<IStaff, 'id' | 'regNo'> | null;
  transport?: Pick<ITransport, 'id' | 'transportNo'> | null;
}

export type NewOnDuty = Omit<IOnDuty, 'id'> & { id: null };
