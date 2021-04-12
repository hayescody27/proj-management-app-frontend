import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class PasswordMatchErrorStateMatcher implements ErrorStateMatcher {

    isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
        const invalidCtrl = !!(control?.touched && control?.invalid && control?.parent.dirty);
        const invalidParent = !!(control?.parent?.get('password').touched && control?.touched && control.dirty && control?.parent?.hasError('passwordMatch') && control?.parent?.dirty);

        return invalidCtrl || invalidParent;
    }
}
