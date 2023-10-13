import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

@Component({
  standalone: true,
  templateUrl: './authority-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AuthorityDeleteDialogComponent {
  authority?: IAuthority;

  constructor(
    protected authorityService: AuthorityService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authorityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
