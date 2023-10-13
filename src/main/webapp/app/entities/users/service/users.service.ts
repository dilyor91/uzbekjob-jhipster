import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsers, NewUsers } from '../users.model';

export type PartialUpdateUsers = Partial<IUsers> & Pick<IUsers, 'id'>;

type RestOf<T extends IUsers | NewUsers> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestUsers = RestOf<IUsers>;

export type NewRestUsers = RestOf<NewUsers>;

export type PartialUpdateRestUsers = RestOf<PartialUpdateUsers>;

export type EntityResponseType = HttpResponse<IUsers>;
export type EntityArrayResponseType = HttpResponse<IUsers[]>;

@Injectable({ providedIn: 'root' })
export class UsersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/users');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(users: NewUsers): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(users);
    return this.http.post<RestUsers>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(users: IUsers): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(users);
    return this.http
      .put<RestUsers>(`${this.resourceUrl}/${this.getUsersIdentifier(users)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(users: PartialUpdateUsers): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(users);
    return this.http
      .patch<RestUsers>(`${this.resourceUrl}/${this.getUsersIdentifier(users)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUsers>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUsers[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUsersIdentifier(users: Pick<IUsers, 'id'>): number {
    return users.id;
  }

  compareUsers(o1: Pick<IUsers, 'id'> | null, o2: Pick<IUsers, 'id'> | null): boolean {
    return o1 && o2 ? this.getUsersIdentifier(o1) === this.getUsersIdentifier(o2) : o1 === o2;
  }

  addUsersToCollectionIfMissing<Type extends Pick<IUsers, 'id'>>(
    usersCollection: Type[],
    ...usersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const users: Type[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const usersCollectionIdentifiers = usersCollection.map(usersItem => this.getUsersIdentifier(usersItem)!);
      const usersToAdd = users.filter(usersItem => {
        const usersIdentifier = this.getUsersIdentifier(usersItem);
        if (usersCollectionIdentifiers.includes(usersIdentifier)) {
          return false;
        }
        usersCollectionIdentifiers.push(usersIdentifier);
        return true;
      });
      return [...usersToAdd, ...usersCollection];
    }
    return usersCollection;
  }

  protected convertDateFromClient<T extends IUsers | NewUsers | PartialUpdateUsers>(users: T): RestOf<T> {
    return {
      ...users,
      createdAt: users.createdAt?.toJSON() ?? null,
      updatedAt: users.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUsers: RestUsers): IUsers {
    return {
      ...restUsers,
      createdAt: restUsers.createdAt ? dayjs(restUsers.createdAt) : undefined,
      updatedAt: restUsers.updatedAt ? dayjs(restUsers.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUsers>): HttpResponse<IUsers> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUsers[]>): HttpResponse<IUsers[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
