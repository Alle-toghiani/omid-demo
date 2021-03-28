import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { DateToStringPipe } from "./animals-list/dateToString.pipe";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule} from "./material.module";
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './navigation/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import {AuthService} from "./auth/auth.service";
import { SubheaderComponent } from './navigation/subheader/subheader.component';
import { AnimalsListComponent } from './animals-list/animals-list.component';
import { AnimalComponent } from './animals-list/animal/animal.component';
import { AnimalsServcice} from "./animals-list/animals.servcice";
import { AddItemComponent } from './animals-list/add-item/add-item.component';
import {UiService} from "./shared/ui.service";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageUnderConstructionComponent } from './page-under-construction/page-under-construction.component';
import { FilterSortComponent } from './animals-list/filter-sort/filter-sort.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    WelcomeComponent,
    SidenavListComponent,
    SubheaderComponent,
    AnimalsListComponent,
    AnimalComponent,
    AddItemComponent,
    DateToStringPipe,
    PageNotFoundComponent,
    PageUnderConstructionComponent,
    FilterSortComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, AnimalsServcice, UiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
