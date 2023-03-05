import dayjs from 'dayjs/esm';

import { States } from 'app/entities/enumerations/states.model';
import { Activities } from 'app/entities/enumerations/activities.model';
import { Days } from 'app/entities/enumerations/days.model';

import { ISchedule, NewSchedule } from './schedule.model';

export const sampleWithRequiredData: ISchedule = {
  id: 76377,
  area: 'Fresh Credit monitor',
  region: 'teal Mouse',
};

export const sampleWithPartialData: ISchedule = {
  id: 64513,
  area: 'Adaptive Beauty',
  region: 'Bike Account plum',
  state: States['Johor'],
  date: dayjs('2023-02-28'),
  day: Days['Teusday'],
};

export const sampleWithFullData: ISchedule = {
  id: 41687,
  area: 'overriding',
  region: 'Streamlined auxiliary Communications',
  state: States['Johor'],
  activity: Activities['Cleaning'],
  date: dayjs('2023-02-28'),
  day: Days['Sunday'],
};

export const sampleWithNewData: NewSchedule = {
  area: 'neural-net',
  region: 'Avon Salad',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
