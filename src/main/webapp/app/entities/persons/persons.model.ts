import { IUsers } from 'app/entities/users/users.model';

export interface IPersons {
  id: number;
  name?: string | null;
  mobilePhone?: string | null;
  userId?: Pick<IUsers, 'id'> | null;
}

export type NewPersons = Omit<IPersons, 'id'> & { id: null };
