import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  errorMsg?: string;
  requestOnGoing: boolean = false;

  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.initForm()
  }

  async onSubmitLogin () {
    if (this.form.invalid || this.requestOnGoing) return;

    const { email, password } = this.form.value;;
    this.errorMsg = undefined;
    this.requestOnGoing = true;

    try {
      await this.authService.login(email, password);
      await this.router.navigateByUrl('/');
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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

}
