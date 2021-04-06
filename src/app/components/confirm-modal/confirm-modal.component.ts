import { Component, Inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'confirm-modal',
    templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {

    constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

}