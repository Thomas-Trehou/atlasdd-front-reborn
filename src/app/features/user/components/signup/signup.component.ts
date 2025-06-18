import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  errorMsg?: string;
  requestOnGoing: boolean = false;
  slug: string = '';

  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.initForm()
  }

  async onSubmitSignup () {
    if (this.form.invalid || this.requestOnGoing) return;

    const { pseudo, email, password, passwordConfirmation } = this.form.value;
    this.errorMsg = undefined;
    this.requestOnGoing = true;


    if (password !== passwordConfirmation) {
      this.errorMsg = 'Les mots de passe ne correspondent pas';
      this.requestOnGoing = false;
      return;
    }

    this.slug = pseudo.replace(/ /g, '-').toLowerCase();


    try {
      await this.authService.signup(pseudo, this.slug, email, password);
      await this.router.navigateByUrl('/verify-info');
    }
    catch (e:any) {
      console.error(e);
      if (e.status === 401) this.errorMsg = 'Invalid email or password';
      else this.errorMsg = 'An error occurred, please try again later';
    }
    this.requestOnGoing = false;
  }

  private initForm() {
    this.form = new FormGroup({
      pseudo: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(35), Validators.pattern('^[a-zA-Z0-9_-]*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

}
