import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompanyMembersComponent } from './list/company-members.component';
import { CompanyMembersDetailComponent } from './detail/company-members-detail.component';
import { CompanyMembersUpdateComponent } from './update/company-members-update.component';
import CompanyMembersResolve from './route/company-members-routing-resolve.service';

const companyMembersRoute: Routes = [
  {
    path: '',
    component: CompanyMembersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyMembersDetailComponent,
    resolve: {
      companyMembers: CompanyMembersResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyMembersUpdateComponent,
    resolve: {
      companyMembers: CompanyMembersResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyMembersUpdateComponent,
    resolve: {
      companyMembers: CompanyMembersResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default companyMembersRoute;
