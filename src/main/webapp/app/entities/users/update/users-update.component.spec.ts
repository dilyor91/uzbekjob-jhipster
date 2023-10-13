import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAuthority } from 'app/entities/authority/authority.model';
import { AuthorityService } from 'app/entities/authority/service/authority.service';
import { UsersService } from '../service/users.service';
import { IUsers } from '../users.model';
import { UsersFormService } from './users-form.service';

import { UsersUpdateComponent } from './users-update.component';

describe('Users Management Update Component', () => {
  let comp: UsersUpdateComponent;
  let fixture: ComponentFixture<UsersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let usersFormService: UsersFormService;
  let usersService: UsersService;
  let authorityService: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UsersUpdateComponent],
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
      .overrideTemplate(UsersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    usersFormService = TestBed.inject(UsersFormService);
    usersService = TestBed.inject(UsersService);
    authorityService = TestBed.inject(AuthorityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Authority query and add missing value', () => {
      const users: IUsers = { id: 456 };
      const authorities: IAuthority[] = [{ id: 16574 }];
      users.authorities = authorities;

      const authorityCollection: IAuthority[] = [{ id: 24305 }];
      jest.spyOn(authorityService, 'query').mockReturnValue(of(new HttpResponse({ body: authorityCollection })));
      const additionalAuthorities = [...authorities];
      const expectedCollection: IAuthority[] = [...additionalAuthorities, ...authorityCollection];
      jest.spyOn(authorityService, 'addAuthorityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ users });
      comp.ngOnInit();

      expect(authorityService.query).toHaveBeenCalled();
      expect(authorityService.addAuthorityToCollectionIfMissing).toHaveBeenCalledWith(
        authorityCollection,
        ...additionalAuthorities.map(expect.objectContaining),
      );
      expect(comp.authoritiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const users: IUsers = { id: 456 };
      const authority: IAuthority = { id: 25946 };
      users.authorities = [authority];

      activatedRoute.data = of({ users });
      comp.ngOnInit();

      expect(comp.authoritiesSharedCollection).toContain(authority);
      expect(comp.users).toEqual(users);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsers>>();
      const users = { id: 123 };
      jest.spyOn(usersFormService, 'getUsers').mockReturnValue(users);
      jest.spyOn(usersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: users }));
      saveSubject.complete();

      // THEN
      expect(usersFormService.getUsers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalledWith(expect.objectContaining(users));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsers>>();
      const users = { id: 123 };
      jest.spyOn(usersFormService, 'getUsers').mockReturnValue({ id: null });
      jest.spyOn(usersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: users }));
      saveSubject.complete();

      // THEN
      expect(usersFormService.getUsers).toHaveBeenCalled();
      expect(usersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUsers>>();
      const users = { id: 123 };
      jest.spyOn(usersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ users });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(usersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAuthority', () => {
      it('Should forward to authorityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(authorityService, 'compareAuthority');
        comp.compareAuthority(entity, entity2);
        expect(authorityService.compareAuthority).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
