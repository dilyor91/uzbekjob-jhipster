import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompanyMembersDetailComponent } from './company-members-detail.component';

describe('CompanyMembers Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyMembersDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CompanyMembersDetailComponent,
              resolve: { companyMembers: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CompanyMembersDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load companyMembers on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CompanyMembersDetailComponent);

      // THEN
      expect(instance.companyMembers).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
