import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPersons } from '../persons.model';
import { PersonsService } from '../service/persons.service';

@Component({
  standalone: true,
  templateUrl: './persons-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PersonsDeleteDialogComponent {
  persons?: IPersons;

  constructor(
    protected personsService: PersonsService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
