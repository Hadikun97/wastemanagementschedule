import { Types } from 'app/entities/enumerations/types.model';

import { ITransport, NewTransport } from './transport.model';

export const sampleWithRequiredData: ITransport = {
  id: 30521,
};

export const sampleWithPartialData: ITransport = {
  id: 26745,
  regsNo: 'Computer invoice',
  type: Types['Garbage_Truck'],
};

export const sampleWithFullData: ITransport = {
  id: 90671,
  transportNo: 'leverage',
  regsNo: 'Ball open-source Architect',
  type: Types['Garbage_Truck'],
};

export const sampleWithNewData: NewTransport = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
