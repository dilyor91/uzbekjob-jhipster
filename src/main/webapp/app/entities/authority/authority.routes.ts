import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AuthorityComponent } from './list/authority.component';
import { AuthorityDetailComponent } from './detail/authority-detail.component';
import { AuthorityUpdateComponent } from './update/authority-update.component';
import AuthorityResolve from './route/authority-routing-resolve.service';

const authorityRoute: Routes = [
  {
    path: '',
    component: AuthorityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuthorityDetailComponent,
    resolve: {
      authority: AuthorityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuthorityUpdateComponent,
    resolve: {
      authority: AuthorityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuthorityUpdateComponent,
    resolve: {
      authority: AuthorityResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default authorityRoute;
