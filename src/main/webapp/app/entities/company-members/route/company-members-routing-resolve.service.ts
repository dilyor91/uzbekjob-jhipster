import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompanyMembers } from '../company-members.model';
import { CompanyMembersService } from '../service/company-members.service';

export const companyMembersResolve = (route: ActivatedRouteSnapshot): Observable<null | ICompanyMembers> => {
  const id = route.params['id'];
  if (id) {
    return inject(CompanyMembersService)
      .find(id)
      .pipe(
        mergeMap((companyMembers: HttpResponse<ICompanyMembers>) => {
          if (companyMembers.body) {
            return of(companyMembers.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default companyMembersResolve;
