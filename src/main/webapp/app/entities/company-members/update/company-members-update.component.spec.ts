import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { CompanyMembersService } from '../service/company-members.service';
import { ICompanyMembers } from '../company-members.model';
import { CompanyMembersFormService } from './company-members-form.service';

import { CompanyMembersUpdateComponent } from './company-members-update.component';

describe('CompanyMembers Management Update Component', () => {
  let comp: CompanyMembersUpdateComponent;
  let fixture: ComponentFixture<CompanyMembersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let companyMembersFormService: CompanyMembersFormService;
  let companyMembersService: CompanyMembersService;
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CompanyMembersUpdateComponent],
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
      .overrideTemplate(CompanyMembersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyMembersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    companyMembersFormService = TestBed.inject(CompanyMembersFormService);
    companyMembersService = TestBed.inject(CompanyMembersService);
    usersService = TestBed.inject(UsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call userId query and add missing value', () => {
      const companyMembers: ICompanyMembers = { id: 456 };
      const userId: IUsers = { id: 27467 };
      companyMembers.userId = userId;

      const userIdCollection: IUsers[] = [{ id: 29068 }];
      jest.spyOn(usersService, 'query').mockReturnValue(of(new HttpResponse({ body: userIdCollection })));
      const expectedCollection: IUsers[] = [userId, ...userIdCollection];
      jest.spyOn(usersService, 'addUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ companyMembers });
      comp.ngOnInit();

      expect(usersService.query).toHaveBeenCalled();
      expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(userIdCollection, userId);
      expect(comp.userIdsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const companyMembers: ICompanyMembers = { id: 456 };
      const userId: IUsers = { id: 8742 };
      companyMembers.userId = userId;

      activatedRoute.data = of({ companyMembers });
      comp.ngOnInit();

      expect(comp.userIdsCollection).toContain(userId);
      expect(comp.companyMembers).toEqual(companyMembers);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyMembers>>();
      const companyMembers = { id: 123 };
      jest.spyOn(companyMembersFormService, 'getCompanyMembers').mockReturnValue(companyMembers);
      jest.spyOn(companyMembersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyMembers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyMembers }));
      saveSubject.complete();

      // THEN
      expect(companyMembersFormService.getCompanyMembers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(companyMembersService.update).toHaveBeenCalledWith(expect.objectContaining(companyMembers));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyMembers>>();
      const companyMembers = { id: 123 };
      jest.spyOn(companyMembersFormService, 'getCompanyMembers').mockReturnValue({ id: null });
      jest.spyOn(companyMembersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyMembers: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyMembers }));
      saveSubject.complete();

      // THEN
      expect(companyMembersFormService.getCompanyMembers).toHaveBeenCalled();
      expect(companyMembersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyMembers>>();
      const companyMembers = { id: 123 };
      jest.spyOn(companyMembersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyMembers });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(companyMembersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsers', () => {
      it('Should forward to usersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usersService, 'compareUsers');
        comp.compareUsers(entity, entity2);
        expect(usersService.compareUsers).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
