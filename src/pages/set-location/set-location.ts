import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Location } from './../../models/location';
@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  location:Location;
  marker:Location;
  constructor(public navCtrl: NavController,private viewCtrl:ViewController, public navParams: NavParams) {
    this.location=this.navParams.get('location');
    if(this.navParams.get('isSet')){
      this.marker=this.navParams.get('location');
    }
  }
  onSetMarker(event){
    this.marker=new Location(event.coords.lat,event.coords.lng);
  }
  onConfirm(){
    this.viewCtrl.dismiss({location:this.marker});
  }
  onAbort(){
    this.viewCtrl.dismiss();    
  }

}
