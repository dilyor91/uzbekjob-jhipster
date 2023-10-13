import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PersonsDetailComponent } from './persons-detail.component';

describe('Persons Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PersonsDetailComponent,
              resolve: { persons: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PersonsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load persons on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PersonsDetailComponent);

      // THEN
      expect(instance.persons).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
