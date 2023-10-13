import dayjs from 'dayjs/esm';
import { IAuthority } from 'app/entities/authority/authority.model';

export interface IUsers {
  id: number;
  userName?: string | null;
  email?: string | null;
  password?: string | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  authorities?: Pick<IAuthority, 'id'>[] | null;
}

export type NewUsers = Omit<IUsers, 'id'> & { id: null };
