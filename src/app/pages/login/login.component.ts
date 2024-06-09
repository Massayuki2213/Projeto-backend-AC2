import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  invalidUser: boolean = false;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {

    if(this.loginForm.value['email'] == "admin@gmail.com" && this.loginForm.value['password'] == "admin") {
      this.router.navigate(["/app"])
    } else {
      this.invalidUser = true;
    }

  }
}

// Usuario para testes:
// admin@gmail.com
// admin