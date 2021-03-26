import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {LoginComponent} from "./auth/login/login.component";
import {AnimalsListComponent} from "./animals-list/animals-list.component";
import {AddItemComponent} from "./animals-list/add-item/add-item.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {PageUnderConstructionComponent} from "./page-under-construction/page-under-construction.component";

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'aboutUs', component: WelcomeComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'animals-list', component: AnimalsListComponent},
  { path: 'page-under-construction', component: PageUnderConstructionComponent},
  { path: 'donation', redirectTo: 'page-under-construction'},
  { path: 'corporation', redirectTo: 'page-under-construction'},
  { path: 'shop', redirectTo: 'page-under-construction'},
  { path: 'contactUs', redirectTo: 'page-under-construction'},
  { path: 'page-not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo:'page-not-found'}

  // { path: 'add-item', component: AddItemComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
