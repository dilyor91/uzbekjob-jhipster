import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICompanyMembers } from '../company-members.model';
import { CompanyMembersService } from '../service/company-members.service';

@Component({
  standalone: true,
  templateUrl: './company-members-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CompanyMembersDeleteDialogComponent {
  companyMembers?: ICompanyMembers;

  constructor(
    protected companyMembersService: CompanyMembersService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.companyMembersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
