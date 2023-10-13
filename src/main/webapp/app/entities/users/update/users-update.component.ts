import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAuthority } from 'app/entities/authority/authority.model';
import { AuthorityService } from 'app/entities/authority/service/authority.service';
import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';
import { UsersFormService, UsersFormGroup } from './users-form.service';

@Component({
  standalone: true,
  selector: 'jhi-users-update',
  templateUrl: './users-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UsersUpdateComponent implements OnInit {
  isSaving = false;
  users: IUsers | null = null;

  authoritiesSharedCollection: IAuthority[] = [];

  editForm: UsersFormGroup = this.usersFormService.createUsersFormGroup();

  constructor(
    protected usersService: UsersService,
    protected usersFormService: UsersFormService,
    protected authorityService: AuthorityService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAuthority = (o1: IAuthority | null, o2: IAuthority | null): boolean => this.authorityService.compareAuthority(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ users }) => {
      this.users = users;
      if (users) {
        this.updateForm(users);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const users = this.usersFormService.getUsers(this.editForm);
    if (users.id !== null) {
      this.subscribeToSaveResponse(this.usersService.update(users));
    } else {
      this.subscribeToSaveResponse(this.usersService.create(users));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsers>>): void {
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

  protected updateForm(users: IUsers): void {
    this.users = users;
    this.usersFormService.resetForm(this.editForm, users);

    this.authoritiesSharedCollection = this.authorityService.addAuthorityToCollectionIfMissing<IAuthority>(
      this.authoritiesSharedCollection,
      ...(users.authorities ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.authorityService
      .query()
      .pipe(map((res: HttpResponse<IAuthority[]>) => res.body ?? []))
      .pipe(
        map((authorities: IAuthority[]) =>
          this.authorityService.addAuthorityToCollectionIfMissing<IAuthority>(authorities, ...(this.users?.authorities ?? [])),
        ),
      )
      .subscribe((authorities: IAuthority[]) => (this.authoritiesSharedCollection = authorities));
  }
}
