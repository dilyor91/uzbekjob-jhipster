import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompanyMembers, NewCompanyMembers } from '../company-members.model';

export type PartialUpdateCompanyMembers = Partial<ICompanyMembers> & Pick<ICompanyMembers, 'id'>;

export type EntityResponseType = HttpResponse<ICompanyMembers>;
export type EntityArrayResponseType = HttpResponse<ICompanyMembers[]>;

@Injectable({ providedIn: 'root' })
export class CompanyMembersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/company-members');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(companyMembers: NewCompanyMembers): Observable<EntityResponseType> {
    return this.http.post<ICompanyMembers>(this.resourceUrl, companyMembers, { observe: 'response' });
  }

  update(companyMembers: ICompanyMembers): Observable<EntityResponseType> {
    return this.http.put<ICompanyMembers>(`${this.resourceUrl}/${this.getCompanyMembersIdentifier(companyMembers)}`, companyMembers, {
      observe: 'response',
    });
  }

  partialUpdate(companyMembers: PartialUpdateCompanyMembers): Observable<EntityResponseType> {
    return this.http.patch<ICompanyMembers>(`${this.resourceUrl}/${this.getCompanyMembersIdentifier(companyMembers)}`, companyMembers, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompanyMembers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompanyMembers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyMembersIdentifier(companyMembers: Pick<ICompanyMembers, 'id'>): number {
    return companyMembers.id;
  }

  compareCompanyMembers(o1: Pick<ICompanyMembers, 'id'> | null, o2: Pick<ICompanyMembers, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompanyMembersIdentifier(o1) === this.getCompanyMembersIdentifier(o2) : o1 === o2;
  }

  addCompanyMembersToCollectionIfMissing<Type extends Pick<ICompanyMembers, 'id'>>(
    companyMembersCollection: Type[],
    ...companyMembersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companyMembers: Type[] = companyMembersToCheck.filter(isPresent);
    if (companyMembers.length > 0) {
      const companyMembersCollectionIdentifiers = companyMembersCollection.map(
        companyMembersItem => this.getCompanyMembersIdentifier(companyMembersItem)!,
      );
      const companyMembersToAdd = companyMembers.filter(companyMembersItem => {
        const companyMembersIdentifier = this.getCompanyMembersIdentifier(companyMembersItem);
        if (companyMembersCollectionIdentifiers.includes(companyMembersIdentifier)) {
          return false;
        }
        companyMembersCollectionIdentifiers.push(companyMembersIdentifier);
        return true;
      });
      return [...companyMembersToAdd, ...companyMembersCollection];
    }
    return companyMembersCollection;
  }
}
