import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { PersonsService } from '../service/persons.service';
import { IPersons } from '../persons.model';
import { PersonsFormService } from './persons-form.service';

import { PersonsUpdateComponent } from './persons-update.component';

describe('Persons Management Update Component', () => {
  let comp: PersonsUpdateComponent;
  let fixture: ComponentFixture<PersonsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personsFormService: PersonsFormService;
  let personsService: PersonsService;
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PersonsUpdateComponent],
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
      .overrideTemplate(PersonsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personsFormService = TestBed.inject(PersonsFormService);
    personsService = TestBed.inject(PersonsService);
    usersService = TestBed.inject(UsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call userId query and add missing value', () => {
      const persons: IPersons = { id: 456 };
      const userId: IUsers = { id: 22064 };
      persons.userId = userId;

      const userIdCollection: IUsers[] = [{ id: 18386 }];
      jest.spyOn(usersService, 'query').mockReturnValue(of(new HttpResponse({ body: userIdCollection })));
      const expectedCollection: IUsers[] = [userId, ...userIdCollection];
      jest.spyOn(usersService, 'addUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ persons });
      comp.ngOnInit();

      expect(usersService.query).toHaveBeenCalled();
      expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(userIdCollection, userId);
      expect(comp.userIdsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const persons: IPersons = { id: 456 };
      const userId: IUsers = { id: 4826 };
      persons.userId = userId;

      activatedRoute.data = of({ persons });
      comp.ngOnInit();

      expect(comp.userIdsCollection).toContain(userId);
      expect(comp.persons).toEqual(persons);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersons>>();
      const persons = { id: 123 };
      jest.spyOn(personsFormService, 'getPersons').mockReturnValue(persons);
      jest.spyOn(personsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ persons });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: persons }));
      saveSubject.complete();

      // THEN
      expect(personsFormService.getPersons).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(personsService.update).toHaveBeenCalledWith(expect.objectContaining(persons));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersons>>();
      const persons = { id: 123 };
      jest.spyOn(personsFormService, 'getPersons').mockReturnValue({ id: null });
      jest.spyOn(personsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ persons: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: persons }));
      saveSubject.complete();

      // THEN
      expect(personsFormService.getPersons).toHaveBeenCalled();
      expect(personsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersons>>();
      const persons = { id: 123 };
      jest.spyOn(personsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ persons });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personsService.update).toHaveBeenCalled();
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
