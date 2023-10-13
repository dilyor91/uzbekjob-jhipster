import { IPersons, NewPersons } from './persons.model';

export const sampleWithRequiredData: IPersons = {
  id: 27677,
};

export const sampleWithPartialData: IPersons = {
  id: 5801,
  name: 'where or',
  mobilePhone: 'lest frantically partake',
};

export const sampleWithFullData: IPersons = {
  id: 27375,
  name: 'after pug disinfect',
  mobilePhone: 'yowza yippee',
};

export const sampleWithNewData: NewPersons = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
