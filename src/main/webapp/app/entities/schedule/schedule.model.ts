import dayjs from 'dayjs/esm';
import { IOnDuty } from 'app/entities/on-duty/on-duty.model';
import { States } from 'app/entities/enumerations/states.model';
import { Activities } from 'app/entities/enumerations/activities.model';
import { Days } from 'app/entities/enumerations/days.model';

export interface ISchedule {
  id: number;
  area?: string | null;
  region?: string | null;
  state?: States | null;
  activity?: Activities | null;
  date?: dayjs.Dayjs | null;
  day?: Days | null;
  onDuty?: Pick<IOnDuty, 'id' | 'dutyNo'> | null;
}

export type NewSchedule = Omit<ISchedule, 'id'> & { id: null };
