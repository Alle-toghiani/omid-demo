import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { animalModel } from "./animal.model";
import {  AnimalsServcice} from "./animals.servcice";
import { AddItemComponent } from "./add-item/add-item.component";
import {AuthService} from "../auth/auth.service";
import {UiService} from "../shared/ui.service";
import {FilterSortComponent} from "./filter-sort/filter-sort.component";

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
  unFilteredList: animalModel[] = [];

  publicDataSub: Subscription;
  privateDataSub: Subscription;
  loadingDataSub: Subscription;
  authSub: Subscription;

  isLoading: boolean = false;

  isAuth:boolean= false;


  dialogRef: MatDialogRef<AddItemComponent>
  dialogFilterRef: MatDialogRef<FilterSortComponent>

  private observableSub : Subscription;

  ngOnInit() {
    this.isAuth = this.authService.isAuth();
    this.authSub = this.authService.authChange.subscribe(authState => {
      console.log(authState)
      this.isAuth = true;
      if (authState === 'guest'){
        this.isAuth = true;
      }else if (authState === 'admin' || authState === 'user'){
        this.isAuth = true;
      }
    })
    this.loadingDataSub = this.animalsService.loadingDataSub.subscribe(isLoading => {
        this.isLoading = isLoading;
      }
    )


    this.publicDataSub = this.animalsService.publicDataSubject.subscribe(list => {
        this.publicList = list;
        this.mergedList = this.publicList.concat(this.privateList);
        this.unFilteredList = this.mergedList;
      }
    )

    this.privateDataSub = this.animalsService.privateDataSubject.subscribe(list => {
        this.privateList = list;
        this.mergedList = this.publicList.concat(this.privateList);
      this.unFilteredList = this.mergedList;
      }
    )



    // const customObservable  = Observable.create( observer => {
    //   let count:number=0;
    //   setInterval(() => {
    //     if(count>3){
    //       observer.error(new Error("Observer is bigger than 3 !!!"));
    //     }else {
    //       observer.next(count);
    //       count++;
    //     }
    //   },1000)
    // })
    //
    //
    // this.observableSub = customObservable.subscribe( data => {
    //   console.log(data);
    // })
  }

    openAddItemDialog(){
      const itemsNum = this.animalsService.getNumberOfPrivateItems();
      const errorMessage = "هر کاربر حداکثر 5 آیتم شخصی می تواند اضافه کند";
      if (itemsNum < 3){
        const dialogRef = this.dialog.open(AddItemComponent)
        // setInterval(()=>{this.dialog.closeAll()},5000)
      }else{
        this.uiService.showSnackbar(errorMessage,null,5000)
      }
    }
  openFilterSortDialog(){
    const dialogFilterRef = this.dialog.open(FilterSortComponent)
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

  onFilter(event){
    let basedOn = event.basedOn

    this.mergedList = this.mergedList.sort((a, b) => {
      if (event.order){
        return(<any>a[basedOn] - <any>b[basedOn])
      }else {
        return(<any>b[basedOn] - <any>a[basedOn])
      }
    })
  }

  flexFilter(criteria:{Field:string,Values:any[]}[]){
    console.log("criteria",criteria);
    let originalArray = this.unFilteredList;
    if (criteria.length > 0 ){
      let matches : animalModel[]=[], count:number = 0;
      function matchesFilter(item){
        let count=0;
        for ( let n=0; n < criteria.length; n++){
          if ( criteria[n]["Values"].indexOf(item[criteria[n]["Field"]]) > -1 ){
            count++;
          }
        }
        return count === criteria.length;
      }

      for ( let i =0 ; i< originalArray.length; i++){
        if (matchesFilter(originalArray[i])){
          matches.push(originalArray[i]);
        }
      }
      this.mergedList = matches;
    } else if (criteria.length === 0){
      this.mergedList = this.unFilteredList;
    }

  }
}

