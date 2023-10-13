import dayjs from 'dayjs/esm';

import { IUsers, NewUsers } from './users.model';

export const sampleWithRequiredData: IUsers = {
  id: 17945,
};

export const sampleWithPartialData: IUsers = {
  id: 27817,
  password: 'yahoo bleakly phew',
  status: 'tightly',
  updatedBy: 'ha',
};

export const sampleWithFullData: IUsers = {
  id: 28163,
  userName: 'differ voluntarily',
  email: 'Jeremie.Price54@yahoo.com',
  password: 'unlike',
  status: 'suspicious',
  createdAt: dayjs('2023-10-12T13:07'),
  updatedAt: dayjs('2023-10-13T08:14'),
  createdBy: 'inside tractor',
  updatedBy: 'napkin',
};

export const sampleWithNewData: NewUsers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
