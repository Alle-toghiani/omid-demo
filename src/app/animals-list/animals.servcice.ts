import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase";
import Firestore = firebase.firestore.Firestore;
import {map} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import { AuthService } from "../auth/auth.service";
import {animalModel} from "./animal.model";
import { nanoid } from "nanoid";
import {AngularFireStorage} from "@angular/fire/storage";

@Injectable()

export class AnimalsServcice {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fireStorage: AngularFireStorage) {}

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

  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

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



  async onUploadData( animalModel: animalModel, fileRef){
    let model : animalModel = animalModel;
    const generatedID = nanoid();
    const downloadURL = await this.pushDataToFireStorage(fileRef,generatedID);

    model.imageAddress =  downloadURL.toString();

    console.log("model",model);

    this.pushDataToCloudFireStore(model, generatedID)

  }

  pushDataToFireStorage( fileRef, generatedID ){
    return new Promise((resolve,reject) => {

      let selectedFile = fileRef

      const storagePath = 'privateData/images/' + generatedID + '/' + generatedID;

      const ref = this.fireStorage.ref(storagePath);


      ref.put(selectedFile).then( (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "%done");
      })
        .then(()=>{
          ref.getDownloadURL().subscribe( (url) =>{
            resolve(url)
        })
      })
      })

      // const task = ref.put(selectedFile)
      //
      // const taskCompleted = () => {
      //   task.task.snapshot.ref.getDownloadURL().then(resolve).catch(reject);
      // }
      //
      // this.uploadProgress = task.percentageChanges();
    // })

  }

  pushDataToCloudFireStore( dataObject: animalModel, generatedID){
    if (this.authService.userIsAdmin()){
      this.firestore.collection('publicData').doc(generatedID)
        .set(dataObject)
        .then(response => {
          console.log("response",response);
        }).catch(error => {
        console.log("error",error);
      })
    }
  }





}
