import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { IPersons } from '../persons.model';
import { PersonsService } from '../service/persons.service';
import { PersonsFormService, PersonsFormGroup } from './persons-form.service';

@Component({
  standalone: true,
  selector: 'jhi-persons-update',
  templateUrl: './persons-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PersonsUpdateComponent implements OnInit {
  isSaving = false;
  persons: IPersons | null = null;

  userIdsCollection: IUsers[] = [];

  editForm: PersonsFormGroup = this.personsFormService.createPersonsFormGroup();

  constructor(
    protected personsService: PersonsService,
    protected personsFormService: PersonsFormService,
    protected usersService: UsersService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUsers = (o1: IUsers | null, o2: IUsers | null): boolean => this.usersService.compareUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ persons }) => {
      this.persons = persons;
      if (persons) {
        this.updateForm(persons);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const persons = this.personsFormService.getPersons(this.editForm);
    if (persons.id !== null) {
      this.subscribeToSaveResponse(this.personsService.update(persons));
    } else {
      this.subscribeToSaveResponse(this.personsService.create(persons));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersons>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(persons: IPersons): void {
    this.persons = persons;
    this.personsFormService.resetForm(this.editForm, persons);

    this.userIdsCollection = this.usersService.addUsersToCollectionIfMissing<IUsers>(this.userIdsCollection, persons.userId);
  }

  protected loadRelationshipsOptions(): void {
    this.usersService
      .query({ filter: 'persons-is-null' })
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing<IUsers>(users, this.persons?.userId)))
      .subscribe((users: IUsers[]) => (this.userIdsCollection = users));
  }
}
