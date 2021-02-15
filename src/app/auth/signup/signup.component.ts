import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import {Route, Router} from "@angular/router";
import { AuthService } from "../auth.service";
import { UiService } from "../../shared/ui.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  constructor (
    private authService: AuthService,
    private uiService: UiService,
    private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if ( !form.valid){
      return;
    }
    this.isLoading = true;
    const {email, password} = form.value;
    this.authService.registerUser({
      email: email,
      password: password
    })
    form.reset()
    this.isLoading = false;
  }
  onWhatAreTheRules(){
    this.uiService.showSnackbar(" در حال حاضر قوانینی وجود ندارد. ", null,5000);
  }

  onSwitchToLogin(){
    this.router.navigate(['login'])
  }

}
