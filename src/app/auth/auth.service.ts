import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";

import {UserModel} from "./user.model";
import {AuthDataModel} from "./auth-data.model";

@Injectable()

export class AuthService {

  private user: UserModel;
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string = null;
  private userObject: any;
  private ADMIN_UID: string = 'p35RHUxS6OdKaQoscad6TJEDrws1';

  constructor(private router: Router, private afAuth: AngularFireAuth) {
  }


  registerUser(authData: AuthDataModel) {

    this.afAuth.createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(response => {
        this.userId = response.user.uid;
        this.userObject = response.user;
        console.log(response.user)
        this.authSuccessfull()
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert("ایمیل در سیستم موجود می باشد")
            break;
          case 'auth/invalid-email':
            alert('ایمیل نامعتبر است')
            break;
          case 'auth/weak-password':
            alert('پسورد ضعیف است')
            break;
          default:
            alert(error.message)
            break;
        }
      });

  }

  login(authData: AuthDataModel) {
    const {email, password} = authData;

    this.afAuth.signInWithEmailAndPassword(
      email,
      password)
      .then(response => {
        this.userId = response.user.uid;
        this.userObject = response.user;
        this.authSuccessfull();
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('ایمیل نامعتبر است')
            break;
          case 'auth/user-disabled':
            alert('دسترسی کاربر مربوطه مسدود شده است با پشتیبانی تماس بگیرید')
            break;
          case 'auth/user-not-found':
            alert('کاربری با ایمیل و پسورد وارد شده در سیستم وجود ندارد')
            break;
          case 'auth/wrong-password':
            alert('پسورد نامعتبر است')
            break;
          default:
            alert(error.message)
            break;
        }
      });

  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
    // this.afAuth.signOut();

  }

  isAuth() {
    return this.isAuthenticated != null;
  }

  authSuccessfull() {
    this.authChange.next(true);
    this.router.navigate(['']);
  }

  getUserID() {
    if (this.userObject !== undefined) {
      return this.userObject.uid;
    }
  }

  userIsAdmin() {
    return (this.userObject !== undefined && this.userId === this.ADMIN_UID) ? true : false;
  }

}

