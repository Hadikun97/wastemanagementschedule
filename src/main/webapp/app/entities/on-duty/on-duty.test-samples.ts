import { IOnDuty, NewOnDuty } from './on-duty.model';

export const sampleWithRequiredData: IOnDuty = {
  id: 48843,
};

export const sampleWithPartialData: IOnDuty = {
  id: 42936,
  dutyNo: 'Handmade',
};

export const sampleWithFullData: IOnDuty = {
  id: 73078,
  dutyNo: 'hybrid',
};

export const sampleWithNewData: NewOnDuty = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
