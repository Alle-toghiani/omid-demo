import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { animalModel } from "./animal.model";
import {  AnimalsServcice} from "./animals.servcice";
import { AddItemComponent } from "./add-item/add-item.component";

@Component({
  selector: 'app-animals-list',
  templateUrl: './animals-list.component.html',
  styleUrls: ['./animals-list.component.scss']
})

export class AnimalsListComponent implements OnInit, OnDestroy {

  constructor(private animalsService: AnimalsServcice, private dialog: MatDialog) {}

  animalsList: animalModel[];
  animalsListSubscription : Subscription;
  dialogRef: MatDialogRef<AddItemComponent>

  ngOnInit() {
    this.animalsListSubscription = this.animalsService.animalsListChanged.subscribe(list => {
      this.animalsList = list;
    })
    this.animalsService.fetchAvailableList();

  }
  ngOnDestroy() {
    this.animalsListSubscription.unsubscribe();
  }

  openDialog(){
    const dialogRef = this.dialog.open(AddItemComponent)
  }
}
