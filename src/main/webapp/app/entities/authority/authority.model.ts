import { IUsers } from 'app/entities/users/users.model';

export interface IAuthority {
  id: number;
  name?: string | null;
  users?: Pick<IUsers, 'id'>[] | null;
}

export type NewAuthority = Omit<IAuthority, 'id'> & { id: null };
