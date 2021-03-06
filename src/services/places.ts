import { Place } from './../models/place';
import { Location } from './../models/location';
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { File } from 'ionic-native';

declare var cordova:any;

@Injectable()
export class PlacesService{
    private places:Place[]=[];

    constructor(private storage:Storage){

    }

    addPlace(title:string,description:string,location:Location,imageUrl:string){
        const place = new Place(title,description,location,imageUrl);
        this.places.push(place);
        this.storage.set('places',this.places)
        .then()
        .catch(
            err=>{
                this.places.splice(this.places.indexOf(place),1);
            }
        )

    }

    loadPlaces(){
        return this.places.slice();
    }

    fetchPlaces(){
        return this.storage.get('places')
        .then(
            (places:Place[])=>{
                this.places=places !=null ? places:[];
                return this.places.slice();
            }
        )
        .catch(
            error=>console.log(error)
        )
    }

    deletePlace(index){
        const place=this.places[index];
        this.places.splice(index,1);
        this.storage.set('places',this.places)
        .then(
            ()=>{
                this.removeFile(place);
            }
        )
        .catch(
            error=>console.log(error)
        )
    }
    private removeFile(place:Place){
        const currentName=place.imagePath.replace(/^.*[\\\/]/,'');
        File.removeFile(cordova.file.dataDirectory,currentName)
        .then()
        .catch(
            ()=>{
                console.log('error while removing file!')
                this.addPlace(place.title,place.description,place.location,place.imagePath);
            }
        )
        
    }
}