import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { every, finalize } from "rxjs/operators";

import { UiService } from "../../shared/ui.service";
import {  AnimalsServcice } from "../animals.servcice";
import { animalModel } from "../animal.model";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  constructor(
    private storage: AngularFireStorage,
    private AnimalsServcice: AnimalsServcice,
    private uiService: UiService ) { }

  selectedFile : File = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  showProgressbar: boolean = false;
  imgSrc : string;
  imageURL: string;
  url ;



  ngOnInit(): void {}


  onSubmit(form : NgForm){
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    const input_age = new Date();
    input_age.setFullYear(Number(year) - Number(form.value.age_year), Number(month) - Number(form.value.age_month), Number(date) - Number(form.value.age_day));
    const createId = Math.floor(Math.random()*10000);

    const uploadObject :animalModel = {
      id: createId,
      gender: form.value.form_breed,
      breed: form.value.breed,
      birthDate: input_age,
      // imageAddress: this.imgSrc,
      vaccination: form.value.vaccination,
      dateAdded: new Date()
    }
    this.AnimalsServcice.pushDataToCloudFireStore(uploadObject);
    //this.storage.upload("/files"+Math.random()+this.path,this.path)
  }

  onFileSelected(event) {


    this.selectedFile = <File>event.target.files[0];
    const createId = Math.floor(Math.random() * 1000000);
    console.log("event type",typeof this.selectedFile,this.selectedFile);

    const filePath = 'privateData/images/'+createId+'/'+createId;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);

    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();
    //
    //   reader.readAsDataURL(event.target.files[0]); // read file as data url
    //
    //   reader.onload = (event) => { // called once readAsDataURL is completed
    //     this.url = event.target.result;
    //   }
    // }


    // this.showProgressbar = true;
    // this.uploadPercent = task.percentageChanges();
    // task.snapshotChanges().pipe(
    //   finalize(() => this.downloadURL = fileRef.getDownloadURL())
    // )
    //   .subscribe(event => {
    //     if (event.state == 'success') {
    //       this.storage.ref('/files/pictures/list/' + createId).getDownloadURL().subscribe(imgURL => {
    //         this.imgSrc = imgURL;
    //
    //       })
    //       this.uiService.showSnackbar("آپلود موفقیت آمیز بود ✔", null, 5000)
    //       this.showProgressbar = false;
    //     }
    //   })
  }


    // console.log(this.downloadURL);



}
