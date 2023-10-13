import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'authority',
        data: { pageTitle: 'uzbekjobjhipsterApp.authority.home.title' },
        loadChildren: () => import('./authority/authority.routes'),
      },
      {
        path: 'users',
        data: { pageTitle: 'uzbekjobjhipsterApp.users.home.title' },
        loadChildren: () => import('./users/users.routes'),
      },
      {
        path: 'persons',
        data: { pageTitle: 'uzbekjobjhipsterApp.persons.home.title' },
        loadChildren: () => import('./persons/persons.routes'),
      },
      {
        path: 'company-members',
        data: { pageTitle: 'uzbekjobjhipsterApp.companyMembers.home.title' },
        loadChildren: () => import('./company-members/company-members.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
