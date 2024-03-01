require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "esri/dijit/PopupTemplate",
  "esri/tasks/query",
  "esri/toolbars/draw",
  "esri/symbols/PictureMarkerSymbol",
  "esri/graphic",

  "dojo/domReady!",
], function (
  Map,
  FeatureLayer,
  UniqueValueRenderer,
  SimpleFillSymbol,
  Color,
  PopupTemplate,
  Query,
  Draw,
  PictureMarkerSymbol,
  Graphic
  
) {
  let mapa = new Map("viewDiv", {
    basemap: "gray-vector",
    center: [-3.5, 40.4],
    zoom: 5,
  });

  let redNaturaFL = new FeatureLayer(
    "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Red_Natura_2000/FeatureServer/0"
  );

  let renderizadorRedNatura = new UniqueValueRenderer(redNaturaFL, "Tipo");

  renderizadorRedNatura.addValue(
    "LIC",
    new SimpleFillSymbol().setColor(new Color("#cbf3f0"))
  );
  renderizadorRedNatura.addValue(
    "ZEPA",
    new SimpleFillSymbol().setColor(new Color("#ffbf69"))
  );

  redNaturaFL.renderer = renderizadorRedNatura;

  let playasFl = new FeatureLayer(
    "https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Playas_2015/FeatureServer/0",{
      outFields:['Nombre','Descripci','Longitud','Anchura','Condicione','Submarinis']
    }
    
  );

  let plantillaPopup = new PopupTemplate({
    title: '{Nombre}',
    fieldInfos: [
      {
        fieldName: "Descripci",
        visible:true,
        label: "Descripción de la playa",
      },
      {
        fieldName: "Longitud",
        visible:true,
        label: "Longitud de la playa",
      },
      {
        fieldName: "Anchura",
        visible:true,
        label: "Anchura de la playa",
      },
      {
        fieldName: "Condicione",
        visible:true,
        label: "Condiciones de la playa",
      },
    ],
  });

  playasFl.infoTemplate = plantillaPopup;

  mapa.on('load',()=>{
    let playasSubmarinismoQuery = new Query()

    playasSubmarinismoQuery.where = "Submarinis = 'Sí'"

    playasFl.queryFeatures(playasSubmarinismoQuery,(featureSet)=>{
      featureSet.features.map((playa)=>{

        let simbologiaPlaya = new PictureMarkerSymbol('https://cdn-icons-png.flaticon.com/512/3145/3145021.png',20,20)
        let graficoPlaya = new Graphic(playa.geometry,simbologiaPlaya)
        mapa.graphics.add(graficoPlaya)

      })
    })
  
  })

  mapa.on('load',innitToolbar)
  let toolbar = new Draw(mapa)

  // Inicializar la herramienta de dibujo para pintar polígonos

  function innitToolbar(){
      toolbar.on('draw-end',addGraphic)
      toolbar.activate(Draw.POLYGON)
      
  }

  // Mostrar el polígono dibujado
  
  function addGraphic(evt){
      toolbar.deactivate()
      mapa.enableMapNavigation();
      let poligono = new SimpleFillSymbol()
      let symbol = new Graphic(evt.geometry,poligono)
      mapa.graphics.add(symbol)
      selectEarthquakes(evt.geometry)

  }

  function selectEarthquakes(inputGeometria){
      let consulta = new Query()
      consulta.geometry = inputGeometria
      redNaturaFL.selectFeatures(consulta)
      let poligonoSymbolo = new SimpleFillSymbol()
      poligonoSymbolo.setColor(new Color([255, 0, 0, 1]));
      redNaturaFL.setSelectionSymbol(poligonoSymbolo)
  }

  



  mapa.addLayers([redNaturaFL, playasFl]);
});
