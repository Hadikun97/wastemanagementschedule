import { License } from 'app/entities/enumerations/license.model';
import { Gender } from 'app/entities/enumerations/gender.model';

import { IStaff, NewStaff } from './staff.model';

export const sampleWithRequiredData: IStaff = {
  id: 58821,
  name: 'payment blockchains',
  address: 'pixel Bike',
  contactNo: 'navigating payment b',
};

export const sampleWithPartialData: IStaff = {
  id: 72078,
  name: 'Factors Bedfordshire',
  address: 'Customer-focused',
  contactNo: 'Tuna needs-based Lia',
};

export const sampleWithFullData: IStaff = {
  id: 85888,
  regNo: 'violet',
  license: License['No'],
  gender: Gender['Female'],
  name: 'frictionless',
  address: 'full-range content orchid',
  contactNo: 'compressing payment ',
};

export const sampleWithNewData: NewStaff = {
  name: 'blue tan Small',
  address: 'SQL',
  contactNo: 'morph enhance genera',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
