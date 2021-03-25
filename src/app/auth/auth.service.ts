import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";

import {UserModel} from "./user.model";
import {AuthDataModel} from "./auth-data.model";
import {AnimalsServcice} from "../animals-list/animals.servcice";

@Injectable()

export class AuthService {

  private user: UserModel;
  authChange = new Subject<any>();
  private isAuthenticated = false;
  private userId: string = null;
  private userObject: any;
  private ADMIN_UID: string = 'p35RHUxS6OdKaQoscad6TJEDrws1';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth) {
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
          case 'auth/network-request-failed':
            alert('با توجه به تحریم ایران توسط گوگل برای استفاده از سرویس های فایربیس می بایست آیپی خود را تغییر دهید ( استفاده از VPN / فیلتر شکن )')
            break;
          default:{
            console.log("VPN error",error);
            // alert(error + error.message);
            }
            break;
        }
      });

  }

  logout() {
    return this.afAuth.signOut()
      .then( ()=> {
        this.authChange.next('guest');

        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      })

    // this.afAuth.signOut();

  }

  isAuth() {
    return this.isAuthenticated;
  }

  authSuccessfull() {
    this.isAuthenticated = true;
    if ( !this.isAuth()){
      this.authChange.next('guest');
    }
    else if ( this.isAuth() && this.userIsAdmin()){
      this.authChange.next('admin');
    } else if (this.isAuth() && !this.userIsAdmin()){
      this.authChange.next('user');
    }
    this.router.navigate(['animals-list']);
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

