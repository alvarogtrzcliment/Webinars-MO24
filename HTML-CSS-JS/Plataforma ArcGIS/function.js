const descripcion = document.getElementById("descripcionZaragoza");
const bottonVerMasMenos = document.getElementById('verMasMenos')

function verMasHandler() {
  console.log(descripcion.childElementCount)

  if (descripcion.childElementCount === 2) {
    const elementoP = document.createElement("p");
    const textoP = document.createTextNode(
      "La idea de la ciudad de 15 minutos se basa en la idea de que los barrios compactos y caminables con una mezcla de viviendas, empleos y servicios pueden fomentar un desarrollo urbano más sostenible y equitativo. Al proporcionar una variedad de servicios y amenidades dentro de una distancia corta, los residentes dependen menos de los automóviles y pueden acceder más fácilmente a lo que necesitan a diario. Esto puede ayudar a reducir la congestión de tráfico, la contaminación del aire y las emisiones de gases de efecto invernadero, mientras también fomenta la actividad física y la interacción social."
    );
    elementoP.appendChild(textoP)
    descripcion.appendChild(elementoP)
    bottonVerMasMenos.innerHTML = 'Ver Menos'

  }

  else if(descripcion.childElementCount > 2){
    descripcion.lastChild.remove()
    bottonVerMasMenos.innerHTML = 'Ver Mas'

  }
}
