
export function botonReactivado(idProducts){

    let botones=document.querySelector(`[data-id="${idProducts}"]`);
  
    botones.disabled=false 
    botones.innerHTML="Agregar"
    botones.style.opacity='1' 
    botones.style.background='rgb(255, 0, 200)'  

    return botones


}