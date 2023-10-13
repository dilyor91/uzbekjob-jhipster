import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  id: 13398,
};

export const sampleWithPartialData: IAuthority = {
  id: 10490,
  name: 'whereas less nor',
};

export const sampleWithFullData: IAuthority = {
  id: 9647,
  name: 'which',
};

export const sampleWithNewData: NewAuthority = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
