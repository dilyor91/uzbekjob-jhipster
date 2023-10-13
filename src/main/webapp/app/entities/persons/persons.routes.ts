import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PersonsComponent } from './list/persons.component';
import { PersonsDetailComponent } from './detail/persons-detail.component';
import { PersonsUpdateComponent } from './update/persons-update.component';
import PersonsResolve from './route/persons-routing-resolve.service';

const personsRoute: Routes = [
  {
    path: '',
    component: PersonsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonsDetailComponent,
    resolve: {
      persons: PersonsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonsUpdateComponent,
    resolve: {
      persons: PersonsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonsUpdateComponent,
    resolve: {
      persons: PersonsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default personsRoute;
