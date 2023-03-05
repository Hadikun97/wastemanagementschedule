import { IUwaste, NewUwaste } from './uwaste.model';

export const sampleWithRequiredData: IUwaste = {
  id: 92540,
  name: 'seamless',
  contactNo: 'bandwidth Account',
  address: 'Future flexibility digital',
};

export const sampleWithPartialData: IUwaste = {
  id: 59579,
  description: 'lavender parsing',
  name: 'Cotton sticky',
  contactNo: 'Florida',
  address: 'Computer Kenya Cotton',
};

export const sampleWithFullData: IUwaste = {
  id: 84025,
  description: 'Refined',
  name: 'Savings',
  contactNo: 'program Granite Saus',
  address: 'Wooden',
};

export const sampleWithNewData: NewUwaste = {
  name: 'multi-byte Computers',
  contactNo: 'Bedfordshire benchma',
  address: 'Solutions Ball FTP',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
