import { Injectable } from "@angular/core";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Injectable()

export class UiService{
  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) {}

  justPrint(){ console.log("printing")};
  showSnackbar(message, action, duration){
    this.snackbar.open(message, action, {
      duration: duration,
      panelClass:['mat-primary']
    });
  }

  showDialog(){

  }
}
