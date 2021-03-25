import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import {Observable, Subject, Subscription} from "rxjs";
import {every, finalize, map, startWith} from "rxjs/operators";

import { UiService } from "../../shared/ui.service";
import {  AnimalsServcice } from "../animals.servcice";
import { animalModel } from "../animal.model";

export interface breedList {
  name: string;
  fa:string;

}


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  constructor(
    private storage: AngularFireStorage,
    private AnimalsServcice: AnimalsServcice,
    private uiService: UiService) { }

  file: any;
  localUrl: any;
  localCompressedURl:any;
  sizeOfOriginalImage:number;
  sizeOFCompressedImage:number;
  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;


  selectedFile : File = null;
  uploadPercent: number;
  downloadURL: Observable<string>;
  showProgressbar: boolean = false;
  imgSrc : string;
  imageURL: string;
  url ;
  isLoading: boolean = false;
  isPushing: boolean = false;
  loadingSub: Subscription;
  pushingSub: Subscription;

  upload_sub:Subscription;

  breed_Control = new FormControl();
  breed_Options: breedList[] = [
    { name:'bulldog', fa: "بولداگ"},
    { name:'German Shepherd', fa: "ژرمن شپرد"},
    { name:'Golden Retriever', fa: "گلدن رتریور"}
  ]
  breed_filteredOptions: Observable<breedList[]>;
  breed_selectedOption:string="undefined";


  ngOnInit(): void {
    this.loadingSub = this.AnimalsServcice.loadingDataSub.subscribe(state => {
      this.isLoading = state;
    })
    this.pushingSub = this.AnimalsServcice.pushingDataSub.subscribe( state => {
      this.isPushing = state;
    })

    this.breed_filteredOptions = this.breed_Control.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(en => en ? this._filter(en) : this.breed_Options.slice())
      );
  }
  ngOnDestroy(){
    this.loadingSub.unsubscribe();
    this.pushingSub.unsubscribe();
  }

  displayFn(user: breedList): string {
    return user && user.fa ? user.fa : '';
  }

  onBreedSelectOption(option){
    // for ( let i=0 ; i<this.breed_Options.length; i++){
    //   if (this.breed_Options[i].name === option.name){
        this.breed_selectedOption = option.name;
    //   } else {
    //     this.breed_Control.setValue(null)
    //     return;
    //   }
    // }
  }

  private _filter(breed: string): breedList[]{
    const filterValue = breed.toLowerCase();

    return this.breed_Options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  async onSubmit(form : NgForm){
    this.isPushing = true;
    let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
    const input_age = new Date();
    input_age.setFullYear(Number(year) - Number(form.value.age_year), Number(month) - Number(form.value.age_month), Number(date) - Number(form.value.age_day));
    const uploadObject :animalModel = {
      name: form.value.name,
      gender: form.value.gender,
      breed: this.breed_selectedOption,
      birthDate: input_age,
      imageAddress: '',
      vaccination: form.value.vaccination,
      description: form.value.description,
      dateAdded: new Date()
    }
    this.showProgressbar = true;
    this.upload_sub = this.AnimalsServcice.uploadProgress.subscribe( progress =>{
      this.uploadPercent = progress;
    })
    await this.AnimalsServcice.onUploadData(uploadObject,this.selectedFile);
    this.upload_sub.unsubscribe();
    this.showProgressbar = false;
    form.reset();
    this.isPushing = false;
    this.selectedFile = null;
    this.url = null;
  }

  onFileSelected(event) {

    this.selectedFile = <File>event.target.files[0];

    if (event.target.files && event.target.files[0]) {

      //Exceeding file size limit
      if ( ( event.target.files[0].size / 1000000 )> 2 ){
        const sizeErrorMessage: string =  "حجم فایل : "+Math.round((this.selectedFile.size/1000)) +"Kb" + "  حجم مجاز: " + "2000" + "Kb";
        this.uiService.showSnackbar(sizeErrorMessage,null,4000);
        this.selectedFile = null;
        return;
      }
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }

  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }


}

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

