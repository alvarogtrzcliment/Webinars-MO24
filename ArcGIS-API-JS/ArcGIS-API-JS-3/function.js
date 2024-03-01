require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",
  "esri/dijit/PopupTemplate",
  "esri/tasks/query",
  "esri/symbols/PictureMarkerSymbol",
  "esri/graphic",
  "esri/toolbars/draw",
  
  
  "dojo/domReady!"],
  
  function(
    Map,
    FeatureLayer,
    UniqueValueRenderer,
    SimpleFillSymbol,
    Color,
    PopupTemplate,
    Query,
    PictureMarkerSymbol,
    Graphic,
    Draw){

  let mapa = new Map("viewDiv",{
    basemap:"gray-vector",
    center:[-3.5,40.4],
    zoom:5
  })

  let redNaturaFL = new FeatureLayer('https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Red_Natura_2000/FeatureServer/0')

  let renderizadorRedNatura = new UniqueValueRenderer(redNaturaFL,'Tipo')

  renderizadorRedNatura.addValue('LIC', new SimpleFillSymbol().setColor(new Color('#cbf3f0')))

  renderizadorRedNatura.addValue('ZEPA', new SimpleFillSymbol().setColor(new Color('#ffbf69')))

  redNaturaFL.renderer = renderizadorRedNatura

  let playasFL = new FeatureLayer('https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Playas_2015/FeatureServer/0',{
    outFields:['Nombre','Descripci','Longitud','Anchura','Condicione','Submarinis']
  })

  let plantillaPopup = new PopupTemplate({
    title:'{Nombre}',
    fieldInfos:[{

      fieldName:'Descripci',
      visible:true,
      label:'Descripción de la Playa'

    },{

      fieldName:'Longitud',
      visible:true,
      label:'Longitud de la Playa'

    },{

      fieldName:'Anchura',
      visible:true,
      label:'Anchura de la Playa'

    },{
      fieldName:'Condicione',
      visible:true,
      label:'Condiciones de la Playa'
    }]
  })

  playasFL.infoTemplate = plantillaPopup

  mapa.on('load',()=>{

    let playasSubarinismoQuery = new Query()
    
    playasSubarinismoQuery.where = "Submarinis = 'Sí'"

    playasFL.queryFeatures(playasSubarinismoQuery,(featureSet)=>{
      
      featureSet.features.map((playa) => {

        let simbologiaPlaya = new PictureMarkerSymbol('https://cdn-icons-png.flaticon.com/512/3145/3145021.png',20,20)
        let graficoPlaya = new Graphic(playa.geometry,simbologiaPlaya)
        mapa.graphics.add(graficoPlaya)

      })

    })

  })

  mapa.on('load',innitToolbar)

  let toolbar = new Draw(mapa)

  function innitToolbar(){
    toolbar.on('draw-end',addGraphic)
    toolbar.activate(Draw.POLYGON)
  }

  function addGraphic(evento){
    toolbar.deactivate()
    mapa.enableMapNavigation()

    let simbologiaPoligono = new SimpleFillSymbol()
    let graficoPoligono = new Graphic(evento.geometry,simbologiaPoligono)

    mapa.graphics.add(graficoPoligono)

    selectRedNatura2000(evento.geometry)
  }

  function selectRedNatura2000(inputGeometry){

    let consultaRedNatura = new Query()
    consultaRedNatura.geometry = inputGeometry

    redNaturaFL.selectFeatures(consultaRedNatura)
    let simbologiaPoligonoRedNatura = new SimpleFillSymbol
    simbologiaPoligonoRedNatura.setColor([255,0,0,1])
    redNaturaFL.setSelectionSymbol(simbologiaPoligonoRedNatura)

  }

  mapa.addLayers([redNaturaFL,playasFL])


})