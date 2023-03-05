import { IBulletin, NewBulletin } from './bulletin.model';

export const sampleWithRequiredData: IBulletin = {
  id: 65533,
  title: 'Human',
  description: 'withdrawal gold',
  name: 'payment',
  contactNo: 'Senior multi-byte de',
};

export const sampleWithPartialData: IBulletin = {
  id: 37406,
  title: 'dot-com Web',
  description: 'Gorgeous Verde',
  name: 'Rest circuit Borders',
  contactNo: 'Licensed Concrete',
};

export const sampleWithFullData: IBulletin = {
  id: 85888,
  title: 'quantify Shirt Belgium',
  description: 'Interface copying',
  name: 'New demand-driven',
  contactNo: 'Tajikistan',
};

export const sampleWithNewData: NewBulletin = {
  title: 'Checking',
  description: 'National Texas',
  name: 'Fresh alarm Buckinghamshire',
  contactNo: 'groupware hack Valle',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
