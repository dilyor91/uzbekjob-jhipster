import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthorityDetailComponent } from './authority-detail.component';

describe('Authority Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AuthorityDetailComponent,
              resolve: { authority: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AuthorityDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load authority on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AuthorityDetailComponent);

      // THEN
      expect(instance.authority).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
