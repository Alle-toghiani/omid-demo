import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable, Subject, Subscription,BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

import { nanoid } from "nanoid";
import { animalModel } from "./animal.model";
import { AuthService } from "../auth/auth.service";

@Injectable()

export class AnimalsServcice {

  private userStateChanged: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fireStorage: AngularFireStorage) {
    this.fetchPublicData();
    this.userStateChanged = this.authService.authChange.subscribe( (value)=>{
        this.fetchPublicData();
        if (value === 'user'){
          this.fetchPrivateData();

        }else if (value === 'admin'){


        }
        else if (value === 'guest' ){
          this.erasePrivateData();
        }
    }
    )
  }

  private animalsList: animalModel[] = [
    {
      "id": "CyhH1d8hRN19QrsGsDMT-",
      "name": "بولت",
      "breed": "bulldog",
      "gender": "male",
      "description": "دارای شناسنامه",
      "vaccination": true
    },
    {
      "id": "XXmv2qm4Sn0MZM68u4UNe",
      "name": "شری",
      "breed": "Golden Retriever",
      "gender": "female",
      "description": "دست آموز",
      "imageAddress": "https://firebasestorage.googleapis.com/v0/b/omid-shelter.appspot.com/o/publicData%2Fimages%2FXXmv2qm4Sn0MZM68u4UNe%2FXXmv2qm4Sn0MZM68u4UNe?alt=media&token=e3c0eadc-a264-45c8-8806-9c85675c0d84",
      "vaccination": true
    },
    {
      "id": "gsYoieVSL-Yb5R4XyXPdm",
      "name": "راسل",
      "breed": "German Shepherd",
      "gender": "male",
      "description": "دارای شناسنامه و گذرنامه، تربیت شده و دارای شناسه الکترونیکی",
      "imageAddress": "https://firebasestorage.googleapis.com/v0/b/omid-shelter.appspot.com/o/publicData%2Fimages%2FgsYoieVSL-Yb5R4XyXPdm%2FgsYoieVSL-Yb5R4XyXPdm?alt=media&token=1d40baa8-d096-4963-b2e9-0f775f9e3352",
      "vaccination": true
    }
  ];
  private privateItems:number=0;


  publicDataSubject = new  BehaviorSubject(this.animalsList);
  privateDataSubject = new BehaviorSubject(this.animalsList);
  newSubject = new BehaviorSubject(this.animalsList);

  uploadProgress= new Subject<number>();
  uploadDataState: Subject<any>;
  loadingDataSub = new Subject<boolean>();
  pushingDataSub = new Subject<boolean>();

  getNumberOfPrivateItems(){
    return this.privateItems;
  }


  fetchPublicData() {
    this.loadingDataSub.next(true);

    // this.firestore.
    // collection('publicData').
    // snapshotChanges().pipe(
    //   map(docArray => {
    //     return docArray.map(doc => {
    //       return {
    //         id: doc.payload.doc.id,
    //         name: doc.payload.doc.data()['name'],
    //         breed: doc.payload.doc.data()['breed'].toString(),
    //         gender: doc.payload.doc.data()['gender'],
    //         birthDate: doc.payload.doc.data()['birthDate'],
    //         description: doc.payload.doc.data()['description'],
    //         imageAddress: doc.payload.doc.data()['imageAddress'],
    //         vaccination: doc.payload.doc.data()['vaccination'],
    //         dateAdded: doc.payload.doc.data()['dateAdded'],
    //       }
    //     })
    //   })
    // ).subscribe((animalsList: animalModel[]) => {
    //   this.animalsList = animalsList;
    //   console.log(this.animalsList);
    //   this.publicDataSubject.next(this.animalsList);
    // }, error => {
    //   console.log(new Error("Error in fetching Public data: " + error))
    // })
    this.publicDataSubject.next(this.animalsList);
    this.loadingDataSub.next(false);
  }

  fetchPrivateData(){
    this.loadingDataSub.next(true);
    this.firestore.
    collection('privateData').doc(this.authService.getUserID()).collection('listItems').
    snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            breed: doc.payload.doc.data()['breed'].toString(),
            gender: doc.payload.doc.data()['gender'],
            birthDate: doc.payload.doc.data()['birthDate'],
            description: doc.payload.doc.data()['description'],
            imageAddress: doc.payload.doc.data()['imageAddress'],
            vaccination: doc.payload.doc.data()['vaccination'],
            dateAdded: doc.payload.doc.data()['dateAdded'],
          }
        })
      })
    ).subscribe((list: animalModel[]) => {
      this.privateItems = list.length;
      this.privateDataSubject.next(list);

    }, error =>{
      console.log(new Error("Error in fetching Private data: " + error))
    })
    this.loadingDataSub.next(false);
  }


  async onUploadData( animalModel: animalModel, fileRef){
    this.pushingDataSub.next(true);
    let model : animalModel = animalModel;
    const generatedID = nanoid();
    const downloadURL = await this.pushDataToFireStorage(fileRef,generatedID);

    model.imageAddress =  downloadURL.toString();

    this.pushDataToCloudFireStore(model, generatedID);
    this.pushingDataSub.next(false);

  }

  pushDataToFireStorage( fileRef, generatedID ){
    return new Promise((resolve,reject) => {

      let selectedFile = fileRef

      let storagePath;

      if ( this.authService.isAuth() && this.authService.userIsAdmin()){
        storagePath = 'publicData/images/' + generatedID + '/' + generatedID;
      } else if ( this.authService.isAuth() && !this.authService.userIsAdmin()){
        storagePath = 'privateData/images/' + this.authService.getUserID() + '/' + generatedID;
      }

      const ref = this.fireStorage.ref(storagePath);


      ref.put(selectedFile).then( (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadProgress.next(progress);
        console.log("Upload is " + progress + "%done");
      })
        .then(()=>{
          ref.getDownloadURL().subscribe( (url) =>{
            resolve(url)
        })
      }).catch((error)=>{
        console.log("Upload to FireStorage failed",error.message);
        reject(error);
      });
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
    let fireStorePath;
    if ( this.authService.userIsAdmin()){
      fireStorePath = 'publicData';
    } else if ( !this.authService.userIsAdmin()){
      fireStorePath = 'privateData'+'/'+this.authService.getUserID()+'/' + 'listItems/';
    }

      this.firestore.collection(fireStorePath).doc(generatedID)
        .set(dataObject)
        .then(response => {
          console.log("response",response);
        }).catch(error => {
        console.log("error",error);
      })
  }


  onDeleteData(id : string){
    if ( this.authService.userIsAdmin()){
      const fireStoragePath = 'publicData/images/' + id;
      this.fireStorage.ref(fireStoragePath).delete();
      this.firestore.collection('publicData').doc(id).delete();

    } else if ( this.authService.isAuth() && !this.authService.userIsAdmin()){
      const fireStoragePath = 'privateDta/images/' + this.authService.getUserID() + '/' + id;
      this.fireStorage.ref(fireStoragePath).delete();
      this.firestore.collection('privateData').doc(this.authService.getUserID()).collection('listItems').doc(id).delete();
    }
  }




  erasePrivateData(){
    this.privateDataSubject.next([]);
  }

  ngOnDestroy(){
    this.userStateChanged.unsubscribe();
  }

}
