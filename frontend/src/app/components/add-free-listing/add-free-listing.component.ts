
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { ImgbbUploadService } from 'src/app/services/imgbb-upload/imgbb-upload.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { FreeListServiceService } from 'src/app/services/freeList-service/free-list-service.service';
import { FreeListing } from 'src/app/interface/freeListing';

@Component({
  selector: 'app-add-free-listing',
  templateUrl: './add-free-listing.component.html',
  styleUrls: ['./add-free-listing.component.css']
})
export class AddFreeListingComponent implements OnInit {

  latitude = 23.41248256345665;
  longitude = 88.48786130507187;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/satellite-streets-v11'

  // data
  source: any;
  markers: any;

  freeListType !: string;

  userToken!: string;
  freeListing: FreeListing[] = [
    {
      "_id": "",
      "userToken": "",
      "picture": [],
      "title": "",
      "category": "",
      "description": "",
      "pickUpTime": "",
      "listFor": 1,
      "location": {
        "lng": 88.48699665399437,
        "lat": 23.412221981538707
      },
      likes: [],
      onHold:false,
      disable: false,
      createdAt: new Date(500000000000),
      updatedAt: new Date(500000000000)

    }];
  listForArr = [
    { id: 1, label: "1 Day", value: 1, status: "true" },
    { id: 2, label: "2 Day", value: 2, status: "false" },
    { id: 3, label: "4 Day", value: 4, status: "false" },
    { id: 4, label: "6 Day", value: 6, status: "false" },
    { id: 5, label: "8 Day", value: 8, status: "false" },
    { id: 6, label: "10 Day", value: 10, status: "false" },
    { id: 7, label: "12 Day", value: 12, status: "false" },
    { id: 8, label: "15 Day", value: 15, status: "false" },
    { id: 9, label: "18 Day", value: 18, status: "false" },
    { id: 10, label: "20 Day", value: 20, status: "false" },
    { id: 11, label: "25 Day", value: 25, status: "false" },
    { id: 12, label: "28 Day", value: 28, status: "false" },

  ];
  categoryArr = [
    { id: 1, label: "Food", value: "Food", status: "true" },
    { id: 2, label: "Non-Food", value: "Non-Food", status: "false" },
  ];
  freeListingPicture: any[] = [];
  listingPicture!: string;

  errMsg!: string;
  status!: any;
  onClickLng !: number;
  onClickLat !: number;

  constructor(private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService, private _toast: NgToastService, private readonly ImgbbService: ImgbbUploadService, private _router: Router, private _freeList: FreeListServiceService) {
    (mapboxgl as any).accessToken = "pk.eyJ1IjoibG90dXNiaXN3YXMiLCJhIjoiY2t5ZTd4ZnFjMDUycjJucG1vamhuMmFxbSJ9.iot_0EeUP_G4rtV33DV_QA";

    this.userToken = String(localStorage.getItem("userId"));
    this.latitude = Number(localStorage.getItem("myLocationLat"));
    this.longitude = Number(localStorage.getItem("myLocationLng"));
  }
  ngOnInit(): void {
    this.initializeMap();
  }
  private initializeMap() {
    var lat = this.latitude;
    var lng = this.longitude;
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.map.flyTo({
          center: [lng, lat]
        })
      });
    }

    this.setFreeListingLocation(lat, lng);
  }
  buildMap(lat: number, lng: number) {
    // this.setFreeListingLocation(lat,lng);
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [lng, lat]
    });


    const trackPin =
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      });

    /// Add map controls
    const navControl = new mapboxgl.NavigationControl({
      visualizePitch: true
    });

    this.map.addControl(navControl, "bottom-right");
    this.map.addControl(trackPin, "bottom-right")

    var marker = new mapboxgl.Marker();

    const add_marker = (event: { lngLat: any; }) => {
      var coordinates = event.lngLat;
      console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
      this.onClickLng = coordinates.lng;
      this.onClickLat = coordinates.lat;
      marker.setLngLat(coordinates).addTo(this.map);
      //  this.myLocationButton = "enabled";
      console.log("click");
    }

    this.map.on('click', add_marker);

  }
  onInput(file: any) {

    this.spinner.show();
    this.ImgbbService
      .upload(file.target.files[0])
      .subscribe((res: any) => {
        this.listingPicture = res['data']['url'];
        this.freeListingPicture.push(this.listingPicture);
        console.log(this.listingPicture);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);

      })
  }
  setFreeListingLocation(latVal: number, lngVal: number) {

    var lat = latVal;
    var lng = lngVal;
    this.buildMap(lat, lng);
    this.onClickLat = lat;
    this.onClickLng = lng;
    console.log(lat, lng);
    const homeLocationJson = {
      type: 'Free Listing Location',
      features: [
        {
          type: 'Free Listing Location',
          geometry: {
            type: 'Point',
            'coordinates': {
              'lng': lng,
              'lat': lat
            }
          },
          properties: {
            title: 'Home'
          }
        }
      ]
    };

    for (const feature of homeLocationJson.features) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = "url(./../../../assets/images/icons/freeListing.png)";

      new mapboxgl.Marker(el)
        .setLngLat([feature.geometry.coordinates.lng, feature.geometry.coordinates.lat])
        .addTo(this.map);

    }

  }
  removePicture(indexNumber: number, indexVal: string) {

    if (this.freeListingPicture[indexNumber] == indexVal) {
      this.freeListingPicture.splice(indexNumber, 1);
    }
    console.log(this.freeListingPicture);

  }

  addFreeFormListingData(freeListForm: NgForm) {

    console.log(freeListForm);
    var getCategoryVal = document.getElementById("category") as HTMLInputElement;
    var categoryVal = getCategoryVal.value;
    console.log(categoryVal);

    var getListFor = document.getElementById("listFor") as HTMLInputElement;
    var listForVal = getListFor.value;
    console.log(listForVal);

    this._freeList.addFreeListingData(this.userToken, this.freeListingPicture, freeListForm.value.title, categoryVal, freeListForm.value.description, freeListForm.value.pickUpTime, Number(listForVal), this.onClickLng, this.onClickLat).subscribe(
      res => {
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 1000);
        this.status = res;
        console.log(this.status);
        if (this.status == true) {
          this._toast.success({ detail: "SUCCESS", summary: 'Listing has been added', position: 'br' });

          setTimeout(() => {
            this.router.navigate(["/my-listing"]);
          }, 2000);
        }
        else {
          this._toast.warning({ detail: "FAILED", summary: 'Unable to add your listing', position: 'br' });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }

      },
      err => {
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 1000);
        this.errMsg = err;
        this._toast.warning({ detail: "FAILED", summary: 'Please try after sometime', position: 'br' });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      },
      () => console.log("ADD FREE LISTING FORM DATA successfully")
    )
  }

}
