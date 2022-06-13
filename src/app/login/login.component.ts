import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // variables del component
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: LoginService,
    private _jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    // Create form
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(x => {
      var token = x.access;
      const decodedToken = this._jwtHelper.decodeToken(token);
      console.log(decodedToken);
      const username = decodedToken['username']
      const permissions = decodedToken['permission']

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("permissions", permissions);
      this.router.navigate(["dashboard"]);
    }), err => {
      console.log(err);
    }
  }

}
