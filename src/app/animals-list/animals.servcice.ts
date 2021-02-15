import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase";
import Firestore = firebase.firestore.Firestore;
import {map} from "rxjs/operators";
import {Subject} from "rxjs";
import { AuthService } from "../auth/auth.service";
import {animalModel} from "./animal.model";


@Injectable()

export class AnimalsServcice {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService) {}

  private animalsList: animalModel[] = [];
  private animalsOfflineList: animalModel[] = [
    {
      id:12345,
      breed: 'bulldog',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog1.jpg',
      vaccination:false
    },
    {
      id:22222,
      name:'bullet',
      breed: 'shiba',
      gender:'female',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog2.jpg',
      vaccination:true
    },
    {
      id:333333,
      breed: 'doggy',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog3.jpg',
      vaccination:false
    },
    {
      id:333333,
      breed: 'doggy',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog3.jpg',
      vaccination:false
    },
    {
      id:333333,
      breed: 'doggy',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog3.jpg',
      vaccination:false
    },
    {
      id:333333,
      breed: 'doggy',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog3.jpg',
      vaccination:false
    },
    {
      id:333333,
      breed: 'doggy',
      gender:'male',
      birthDate:new Date('July 20, 2019 00:20:18'),
      imageAddress: '../../assets/img/dog/dog3.jpg',
      vaccination:false
    }
  ]

  animalsListChanged = new Subject<animalModel[]>();

  getAnimalsList(){
    return this.animalsList.slice();
  }


  fetchAvailableList() {
    // this.firestore.
    // collection('animalsList').
    // snapshotChanges().pipe(
    //   map(docArray => {
    //     return docArray.map(doc => {
    //       return {
    //         id: Number(doc.payload.doc.id),
    //         gender: doc.payload.doc.data()['gender'],
    //         breed: doc.payload.doc.data()['breed'].toString(),
    //         imageAddress: doc.payload.doc.data()['imageAddress'],
    //         description: doc.payload.doc.data()['description']
    //       }
    //     })
    //   })
    // ).subscribe((animalsList: animalModel[]) => {
    //   this.animalsList = animalsList;
    //   this.animalsListChanged.next([...this.animalsList]);
    // })
    this.animalsListChanged.next([...this.animalsOfflineList]);
  }

  addDataToDatabase(animalItem: animalModel){
    this.firestore.collection('/animalsList').add(animalItem);
  }

  uploadDataToFirestore(animalObject: animalModel){
    this.firestore.collection('/')
  }

  fetchPublicData(){

  }

  pushDataToCloudFireStore( item: animalModel){
    if (this.authService.userIsAdmin()){
      this.firestore.collection('publicData')
        .add(item)
        .then(response => {
          console.log("response",response.id);
        }).catch(error => {
          console.log("error",error);
      })
    }
  }

  onUploadData(animalModel: animalModel, fileRef){

  }

  pushDataToFireStorage( fileRef ){

    let selectedFile = <File>fileRef.target.files[0];

  }

  generateID(){
    const createId = Math.floor(Math.random() * 100000000);
  }



}
