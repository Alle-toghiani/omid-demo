import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { AuthDataModel } from "../auth-data.model";
import {interval} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  user : AuthDataModel;
  hide : boolean = true;

  constructor(
    private authService:AuthService,
    private router: Router ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){

    this.isLoading = true;
    if ( !form.valid){
      return;
    }
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
    this.isLoading = false;
    form.reset();
  }

  onForgotPassword(){
    alert('create a new account')
  }

  onCreateAccount(){
    this.router.navigate(['signup']);

  }

}
