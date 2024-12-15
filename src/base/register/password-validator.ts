import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidator {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    // Check if passwords are matching. If not then add the error 'passwordsNotMatching: true' to the form
    if ((password === passwordConfirm) && (password !== null && passwordConfirm !== null)) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }

}

//O PasswordValidator é uma classe utilitária Angular que define um validador customizado para garantir que dois campos
// (neste caso, password e passwordConfirm) sejam iguais. Esse validador é usado em formulários reativos para validar a consistência das senhas.
