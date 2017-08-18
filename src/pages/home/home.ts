import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from "../add-place/add-place";
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";
import { PlacePage } from "../place/place";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  ngOnInit(): void {
    this.placesService.fetchPlaces()
    .then(
      (places:Place[])=>this.places=places
    )
  }
  addPlacePage = AddPlacePage;
  places:Place[]=[];
  constructor(public navCtrl: NavController,private modalCtrl:ModalController,private placesService:PlacesService) {

  }
  ionViewWillEnter(){
    this.places=this.placesService.loadPlaces();
  }
  onOpenPlace(place:Place,i:number){
   const modal= this.modalCtrl.create(PlacePage,{place:place,index:i})
   modal.present();
  }
}
