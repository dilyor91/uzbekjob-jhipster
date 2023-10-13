import { ICompanyMembers, NewCompanyMembers } from './company-members.model';

export const sampleWithRequiredData: ICompanyMembers = {
  id: 32246,
};

export const sampleWithPartialData: ICompanyMembers = {
  id: 18750,
  companyName: 'peanut complex',
  businessRegNum: 'ack',
  companyAddress: 'ingrate',
  subscriberName: 'poised proclaim',
  phoneNumber: 'inbox er within',
  membersType: 'COMPANY_MEMBER',
};

export const sampleWithFullData: ICompanyMembers = {
  id: 11391,
  companyName: 'around',
  businessRegNum: 'discipline ha fortnight',
  represantitiveName: 'replenish mysterious tangible',
  companyAddress: 'amid commerce whose',
  subscriberName: 'but indeed gah',
  phoneNumber: 'from inasmuch',
  membersType: 'COMPANY_MEMBER',
};

export const sampleWithNewData: NewCompanyMembers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
