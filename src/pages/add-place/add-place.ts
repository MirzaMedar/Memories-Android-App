import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { SetLocationPage } from "../set-location/set-location";
import { Location } from './../../models/location';
import { Geolocation, Camera, File, Entry } from 'ionic-native';
import { PlacesService } from "../../services/places";

declare var cordova:any;

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location:Location={
    lat:43.34796328330018,
    lng:17.805731826658644
  }
  imageUrl='';
  locationIsSet=false;
  constructor(public navCtrl: NavController,private modalCtrl:ModalController, public navParams: NavParams,private loadingCtrl:LoadingController,private toastCtrl:ToastController,private placesService:PlacesService) {
  }

  onSubmit(f:NgForm){
    this.placesService.addPlace(f.value.title,f.value.description,this.location,this.imageUrl);
    f.form.reset();
    this.location={
      lat:43.34796328330018,
      lng:17.805731826658644
    }
    this.imageUrl='';
    this.locationIsSet=false;
  }
  onOpenMap(){
    const modal =  this.modalCtrl.create(SetLocationPage,{location:this.location,isSet:this.locationIsSet});
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
        this.location=data.location;
        this.locationIsSet=true;
      }
    })
  }
  onLocateMethod(){
    const loader = this.loadingCtrl.create({
      content:'Getting your location!'
    });
    loader.present();
    Geolocation.getCurrentPosition()
    .then(
      location=>{
        loader.dismiss();
        this.location.lat=location.coords.latitude;
        this.location.lng=location.coords.longitude;
        this.locationIsSet=true;
      }
    )
    .catch(
      error=>{
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message:'Could not get location, please pick it manually!',
          duration:2500
        });
        toast.present();
      }
    );
  }
  onTakePhoto(){
    Camera.getPicture({
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation:true
    })
    .then(imageData=>{
      const currentName=imageData.replace(/^.*[\\\/]/,'');
      const path = imageData.replace(/[^\/]*$/,'');
      const newFILEnAME = new Date().getUTCMilliseconds()+'.jpg';
      File.moveFile(path,currentName,cordova.file.dataDirectory,newFILEnAME)
      .then(
        (data:Entry)=>{
          this.imageUrl=data.nativeURL;
          Camera.cleanup();
          File.removeFile(path,currentName);
        }
      )
      .catch(
        err=>{
          this.imageUrl='';
          const toast = this.toastCtrl.create(
            {
              message:'Not saved!',
              duration:2500
            }
          );
          toast.present();
          Camera.cleanup();
        }
      )
      this.imageUrl=imageData;
    })
    .catch(
      error=>{
        const toast = this.toastCtrl.create(
          {
            message:'Not saved!',
            duration:2500
          }
        );
        toast.present();
      }
    );
  }
}
