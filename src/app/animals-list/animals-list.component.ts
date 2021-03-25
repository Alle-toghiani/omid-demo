import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { animalModel } from "./animal.model";
import {  AnimalsServcice} from "./animals.servcice";
import { AddItemComponent } from "./add-item/add-item.component";
import {AuthService} from "../auth/auth.service";
import {UiService} from "../shared/ui.service";

@Component({
  selector: 'app-animals-list',
  templateUrl: './animals-list.component.html',
  styleUrls: ['./animals-list.component.scss']
})

export class AnimalsListComponent implements OnInit, OnDestroy {

  constructor(
    private authService : AuthService,
    private animalsService: AnimalsServcice,
    private dialog: MatDialog,
    private uiService: UiService) {
  }

  publicList: animalModel[] = [];
  privateList: animalModel[] = [];
  mergedList: animalModel[] = [];

  publicDataSub: Subscription;
  privateDataSub: Subscription;
  loadingDataSub: Subscription;
  authSub: Subscription;

  isLoading: boolean = false;

  isAuth:boolean= false;


  dialogRef: MatDialogRef<AddItemComponent>

  ngOnInit() {
    this.isAuth = this.authService.isAuth();
    this.authSub = this.authService.authChange.subscribe(authState => {
      console.log(authState)
      this.isAuth = true;
      if (authState === 'guest'){
        this.isAuth = true;
        console.log("guest")
      }else if (authState === 'admin' || authState === 'user'){
        this.isAuth = true;
        console.log("admin true")
      }
    })


    this.loadingDataSub = this.animalsService.loadingDataSub.subscribe(isLoading => {
        this.isLoading = isLoading;
      }
    )


    this.publicDataSub = this.animalsService.publicDataSubject.subscribe(list => {
        this.publicList = list;
        this.mergedList = this.publicList.concat(this.privateList);
      }
    )

    this.privateDataSub = this.animalsService.privateDataSubject.subscribe(list => {
        this.privateList = list;
        this.mergedList = this.publicList.concat(this.privateList);
      }
    )
  }

    openDialog(){
      const itemsNum = this.animalsService.getNumberOfPrivateItems();
      const errorMessage = "هر کاربر حداکثر 5 آیتم شخصی می تواند اضافه کند";
      if (itemsNum < 3){
        const dialogRef = this.dialog.open(AddItemComponent)
      }else{
        this.uiService.showSnackbar(errorMessage,null,5000)
      }
    }

  ngOnDestroy(){
    this.publicDataSub.unsubscribe();
    this.privateDataSub.unsubscribe();
    this.loadingDataSub.unsubscribe();
    // this.authSub.unsubscribe();
  }

  onDeleteItem(id: string){
    this.animalsService.onDeleteData(id);

  }
}

