class MyMap {
  constructor(latitude, longitude) {
    // this.d3 = d3;
    this.nativeLandData = null;
    this.nativeLandPolys = [];
    this.ipData = null;
    this.nativeLandLayer = true;
    this.datascapesPoints = [];
    this.slidersMenu = document.querySelector("#sliders-container");
    console.log(this.slidersMenu);
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomOutLvl = 3;
    this.currentTile = null;

    this.style;
    this.line = [];
    this.zoomLvl = 15;

    this.ipInfo = {
      publicIP: null,
      lat: null,
      lng: null,
      continent: null,
      region: null,
      city: null,
    };

    this.initMap();
    this.setBlackTile();
    this.zoomOut();

    this.explorationState();
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

  toggleNativeLandLayer() {
    // console.log(this.nativeLandData);
    if (this.nativeLandLayer) {
      for (let i = 0; i < this.nativeLandData.length; i++) {
        let nativeLandPoly = this.nativeLandData[i].polygon.addTo(this.map);
        this.addListenersOnPolygon(
          this.nativeLandData[i].polygon,
          this.nativeLandData[i].link
        );
        this.nativeLandPolys.push(nativeLandPoly);
      }
    } else {
    }
  }

  initPolyline(datascapesData) {
    this.polyline = L.polyline(datascapesData, {
      color: "white",
      weight: "0.3",
      zindex: 100,
      className: "data-scapes-polyline",
    })
      .addTo(this.map)
      .bringToFront();
    // this.conversionLatLngtoPoints(datascapesData);
  }

  toggleIPinfo() {
    console.log(this.ipData);
  }
  // latlngtolayerpoint not a function? broken?
  conversionLatLngtoPoints(datascapesData) {
    console.log(datascapesData.length);

    for (let i = 0; i < datascapesData.length; i++) {
      console.log(datascapesData[i]);
      this.point = latLngToLayerPoint(datascapesData[i]);
      // console.log(point);
    }
    //latLngToLayerPoint
  }

  zoomOut() {
    if (this.zoomLvl > this.zoomOutLvl) {
      this.zoomLvl--;
      this.map.flyTo([this.latitude, this.longitude], this.zoomLvl, {
        animate: true,
        duration: 0.75,
      });
      setTimeout(() => this.zoomOut(), 850);
    } else if (this.zoomLvl <= this.zoomOutLvl) {
      // Go to black;
      // console.log(this.polyline);
      this.setWorldMapTile();
    }
  }

  addListenersOnPolygon(polygon, link) {
    polygon.on("click", function (event) {
      window.open(link, "_blank").focus();
    });
    polygon.on("mouseover", function (event) {
      // console.log(event.target);
      event.target.setStyle({
        color: "white",
        fillOpacity: 0.5,
        stroke: false,
        className: "native-land-polygons",
      });
    });
  }

  explorationState() {
    this.slidersMenu.style.opacity = `1`;
    let self = this;
    //make sliders affect the opacity of the selected layer on change
    // for native-land slider
    this.slidersMenu
      .querySelector("#native-land-slider")
      .addEventListener("change", (e) => {
        console.log(e.target.value / 100);

        let currentAlpha = e.target.value / 100;
        for (let i = 0; i < self.nativeLandPolys.length; i++) {
          console.log(currentAlpha);
          self.nativeLandPolys[i].setStyle({
            color: "white",
            fillOpacity: currentAlpha,
            stroke: false,
            className: "native-land-polygons",
          });
        }
        //set the polygons opacity to the value
      });

    // For mercator slider
    this.slidersMenu
      .querySelector("#mercator-slider")
      .addEventListener("change", (e) => {
        console.log(e.target.value / 100);

        let currentAlpha = e.target.value / 100;
        self.currentTile.options.opacity = currentAlpha;
      });
  }
}