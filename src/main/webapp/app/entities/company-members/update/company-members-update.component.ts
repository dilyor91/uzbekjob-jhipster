import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { MembersTypeEnum } from 'app/entities/enumerations/members-type-enum.model';
import { CompanyMembersService } from '../service/company-members.service';
import { ICompanyMembers } from '../company-members.model';
import { CompanyMembersFormService, CompanyMembersFormGroup } from './company-members-form.service';

@Component({
  standalone: true,
  selector: 'jhi-company-members-update',
  templateUrl: './company-members-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CompanyMembersUpdateComponent implements OnInit {
  isSaving = false;
  companyMembers: ICompanyMembers | null = null;
  membersTypeEnumValues = Object.keys(MembersTypeEnum);

  userIdsCollection: IUsers[] = [];

  editForm: CompanyMembersFormGroup = this.companyMembersFormService.createCompanyMembersFormGroup();

  constructor(
    protected companyMembersService: CompanyMembersService,
    protected companyMembersFormService: CompanyMembersFormService,
    protected usersService: UsersService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUsers = (o1: IUsers | null, o2: IUsers | null): boolean => this.usersService.compareUsers(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyMembers }) => {
      this.companyMembers = companyMembers;
      if (companyMembers) {
        this.updateForm(companyMembers);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const companyMembers = this.companyMembersFormService.getCompanyMembers(this.editForm);
    if (companyMembers.id !== null) {
      this.subscribeToSaveResponse(this.companyMembersService.update(companyMembers));
    } else {
      this.subscribeToSaveResponse(this.companyMembersService.create(companyMembers));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompanyMembers>>): void {
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

  protected updateForm(companyMembers: ICompanyMembers): void {
    this.companyMembers = companyMembers;
    this.companyMembersFormService.resetForm(this.editForm, companyMembers);

    this.userIdsCollection = this.usersService.addUsersToCollectionIfMissing<IUsers>(this.userIdsCollection, companyMembers.userId);
  }

  protected loadRelationshipsOptions(): void {
    this.usersService
      .query({ filter: 'companymembers-is-null' })
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing<IUsers>(users, this.companyMembers?.userId)))
      .subscribe((users: IUsers[]) => (this.userIdsCollection = users));
  }
}
