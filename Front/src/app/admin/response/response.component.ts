import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintResponse } from 'src/app/core/ComplaintResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent {
  @Input() complaintId!: number;
  @Output() submitResponse = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  responseMessage: string = '';

  handleSubmit() {
    if (this.responseMessage.trim()) {
      this.submitResponse.emit(this.responseMessage);
    }
  }

  handleCancel() {
    this.cancel.emit();
    this.responseMessage = '';
  }
}
