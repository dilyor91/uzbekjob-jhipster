import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AuthorityService } from '../service/authority.service';
import { IAuthority } from '../authority.model';
import { AuthorityFormService } from './authority-form.service';

import { AuthorityUpdateComponent } from './authority-update.component';

describe('Authority Management Update Component', () => {
  let comp: AuthorityUpdateComponent;
  let fixture: ComponentFixture<AuthorityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let authorityFormService: AuthorityFormService;
  let authorityService: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AuthorityUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AuthorityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthorityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authorityFormService = TestBed.inject(AuthorityFormService);
    authorityService = TestBed.inject(AuthorityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const authority: IAuthority = { id: 456 };

      activatedRoute.data = of({ authority });
      comp.ngOnInit();

      expect(comp.authority).toEqual(authority);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthority>>();
      const authority = { id: 123 };
      jest.spyOn(authorityFormService, 'getAuthority').mockReturnValue(authority);
      jest.spyOn(authorityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authority });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authority }));
      saveSubject.complete();

      // THEN
      expect(authorityFormService.getAuthority).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(authorityService.update).toHaveBeenCalledWith(expect.objectContaining(authority));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthority>>();
      const authority = { id: 123 };
      jest.spyOn(authorityFormService, 'getAuthority').mockReturnValue({ id: null });
      jest.spyOn(authorityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authority: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authority }));
      saveSubject.complete();

      // THEN
      expect(authorityFormService.getAuthority).toHaveBeenCalled();
      expect(authorityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthority>>();
      const authority = { id: 123 };
      jest.spyOn(authorityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authority });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(authorityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
