import { IUsers } from 'app/entities/users/users.model';
import { MembersTypeEnum } from 'app/entities/enumerations/members-type-enum.model';

export interface ICompanyMembers {
  id: number;
  companyName?: string | null;
  businessRegNum?: string | null;
  represantitiveName?: string | null;
  companyAddress?: string | null;
  subscriberName?: string | null;
  phoneNumber?: string | null;
  membersType?: keyof typeof MembersTypeEnum | null;
  userId?: Pick<IUsers, 'id'> | null;
}

export type NewCompanyMembers = Omit<ICompanyMembers, 'id'> & { id: null };
