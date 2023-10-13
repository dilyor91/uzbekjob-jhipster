import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersons } from '../persons.model';
import { PersonsService } from '../service/persons.service';

export const personsResolve = (route: ActivatedRouteSnapshot): Observable<null | IPersons> => {
  const id = route.params['id'];
  if (id) {
    return inject(PersonsService)
      .find(id)
      .pipe(
        mergeMap((persons: HttpResponse<IPersons>) => {
          if (persons.body) {
            return of(persons.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default personsResolve;
