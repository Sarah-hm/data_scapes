class MyMap {
  constructor(latitude, longitude, zoomlvl, d3) {
    // this.d3 = d3;
    this.nativeLandLayer = true;
    this.datascapesPoints = [];

    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomLvl = zoomlvl;
    this.zoomOutLvl = 3;
    this.currentTile = null;

    this.style;
    this.line = [];
    this.zoomLvl = 10;

    this.initMap();
    this.setBlackTile();
    this.zoomOut();
  }

  setDatascapes() {}
  initMap(currentCoords) {
    this.map = L.map("map").setView(
      [this.latitude, this.longitude],
      this.zoomLvl,
      {}
    );
  }

  setBlackTile() {
    this.currentTile = L.tileLayer(
      "https://hybrid.concordia.ca/S_HONTOY/tile_blackout.jpg",
      {
        zIndex: -5,
        opacity: 1,
        reuseTiles: true,
      }
    ).addTo(this.map);
  }

  setWorldMapTile() {
    this.currentTile = L.tileLayer(
      "https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        zIndex: -5,
        opacity: 0.5,
        reuseTiles: true,
        minZoom: 2,
        maxZoom: 15,
      }
    ).addTo(this.map);
  }

  setWorldMapLightMode() {
    this.currentTile = L.tileLayer(
      "https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        zIndex: -5,
        opacity: 0.5,
        reuseTiles: true,
        minZoom: 2,
        maxZoom: 15,
      }
    ).addTo(this.map);
  }

  toggleNativeLandLayer(nativeLandData) {
    console.log(nativeLandData);
    if (this.nativeLandLayer) {
      for (let i = 0; i < nativeLandData.length; i++) {
        nativeLandData[i].addTo(this.map);
      }
    } else {
    }
  }

  initPolyline(datascapesData) {
    this.polyline = L.polyline(datascapesData, {
      color: "white",
      weight: "0.2",
      zindex: 5000,
      className: "data-scapes-polyline",
    }).addTo(this.map);
    this.conversionLatLngtoPoints(datascapesData);
  }

  conversionLatLngtoPoints(datascapesData) {
    console.log(datascapesData.length);

    for (let i = 0; i < datascapesData.length; i++) {
      console.log(datascapesData[i]);
      this.point = latLngToLayerPoint(datascapesData[i]);
      console.log(point);
    }
    //latLngToLayerPoint
  }

  zoomOut() {
    if (this.zoomLvl > this.zoomOutLvl) {
      this.zoomLvl--;
      this.map.flyTo([this.latitude, this.longitude], this.zoomLvl, {
        animate: true,
        duration: 1,
      });
      setTimeout(() => this.zoomOut(), 1250);
    } else if (this.zoomLvl <= this.zoomOutLvl) {
      // Go to black;
      console.log(this.polyline);
      this.setWorldMapTile();
      setTimeout(() => {
        console.log(this.currentTile);
        this.currentTile({ opacity: 1.0 });
      }, 1000);
      //put native land
    }
  }
}
