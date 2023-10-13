import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersons, NewPersons } from '../persons.model';

export type PartialUpdatePersons = Partial<IPersons> & Pick<IPersons, 'id'>;

export type EntityResponseType = HttpResponse<IPersons>;
export type EntityArrayResponseType = HttpResponse<IPersons[]>;

@Injectable({ providedIn: 'root' })
export class PersonsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/persons');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(persons: NewPersons): Observable<EntityResponseType> {
    return this.http.post<IPersons>(this.resourceUrl, persons, { observe: 'response' });
  }

  update(persons: IPersons): Observable<EntityResponseType> {
    return this.http.put<IPersons>(`${this.resourceUrl}/${this.getPersonsIdentifier(persons)}`, persons, { observe: 'response' });
  }

  partialUpdate(persons: PartialUpdatePersons): Observable<EntityResponseType> {
    return this.http.patch<IPersons>(`${this.resourceUrl}/${this.getPersonsIdentifier(persons)}`, persons, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPersons>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPersons[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPersonsIdentifier(persons: Pick<IPersons, 'id'>): number {
    return persons.id;
  }

  comparePersons(o1: Pick<IPersons, 'id'> | null, o2: Pick<IPersons, 'id'> | null): boolean {
    return o1 && o2 ? this.getPersonsIdentifier(o1) === this.getPersonsIdentifier(o2) : o1 === o2;
  }

  addPersonsToCollectionIfMissing<Type extends Pick<IPersons, 'id'>>(
    personsCollection: Type[],
    ...personsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const persons: Type[] = personsToCheck.filter(isPresent);
    if (persons.length > 0) {
      const personsCollectionIdentifiers = personsCollection.map(personsItem => this.getPersonsIdentifier(personsItem)!);
      const personsToAdd = persons.filter(personsItem => {
        const personsIdentifier = this.getPersonsIdentifier(personsItem);
        if (personsCollectionIdentifiers.includes(personsIdentifier)) {
          return false;
        }
        personsCollectionIdentifiers.push(personsIdentifier);
        return true;
      });
      return [...personsToAdd, ...personsCollection];
    }
    return personsCollection;
  }
}
