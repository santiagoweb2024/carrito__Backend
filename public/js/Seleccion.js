
import {activarBoton,productosActualizados} from "./ActivarBotones.js"
import {carritoID} from './InputBusqueda.js'




const informacion = document.getElementById('seccion-info');
const carritoFiltrado= document.getElementById("carrito-filtrado");
const seleccionar = document.getElementById("seleccionar");  
const carritoInput= document.getElementById("carrito-input");  
const carritoCompras=document.getElementById('carrito-compras') 
 let seleccion=document.querySelector(".select")  
 //let carritoID=[]
 console.log(seleccion)

function crearBotones() {
    let boton = document.createElement('button');
    boton.innerHTML = 'Agregar';
    boton.classList.add('botones__agregar');
    return boton; 
} 

seleccion.addEventListener('click', (e) => { 
    if (e.target.value === "Todos") {  
        informacion.style.display = 'none';
        carritoFiltrado.style.display = 'grid';  

        console.log(e.target);
        todosLosProducts();
    } 
}, { once: true });  


/*  (async()=>{ 

    try{ 
        const reponse=await fetch(`http://localhost:5000/carrito/productos`,{ 
            method:"GET",
            headers:{
                "Content-Type":"application/Json"
            }

        }) 

        if(!reponse.ok){
            throw new Error("hubo un error al recibir los productos");
            
        }  

        carritoID= await reponse.json()

    } 

    catch(err){
        console.log('hubo un error al recibir los productos',err.message) 
        return err
    }

 })()  */




 
 async function todosLosProducts(){  
    carritoFiltrado.innerHTML=''

  carritoID.length > 0 &&  carritoID.forEach((producto,i)=>{  
        const contenedorDiv = document.createElement('div');
        contenedorDiv.classList.add('tarjeta');
        let color = document.createElement('p');
        let precio = document.createElement('p');

        contenedorDiv.innerHTML += `
            <h2 class="titulo__tarjeta">${producto.nombre}</h2> 
        
            <img class="imagenes__tarjeta" src="${producto.imagen ? producto.imagen : ''}" alt="">
        `; 
        color.textContent = 'Color: ' + producto.color; 
        precio.textContent = '$' + producto.precio;
        color.classList.add('color__tarjeta');
        precio.classList.add('precio');
        
        let botones = crearBotones();
        botones.dataset.id = i;
        contenedorDiv.appendChild(color);
        contenedorDiv.appendChild(precio);
        contenedorDiv.appendChild(botones);
         carritoCompras.style.display='none'
        carritoFiltrado.append(contenedorDiv);  
        carritoFiltrado.scrollIntoView({
            behavior:'smooth',
            block:'start'

        }) 
        

        localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados)); 
        activarBoton() 
        
        
    
    })

 }  



    
 seleccionar.addEventListener('change', (e) => {
    let valorSeleccion = e.target.value; 
console.log('valor seleccion',valorSeleccion)
    let productosFiltrados = carritoID.filter(producto => producto.categoria === valorSeleccion);

    if (productosFiltrados.length > 0) {  
        carritoFiltrado.innerHTML = '';

        productosFiltrados.forEach((producto) => { 
            const contenedorDiv = document.createElement('div');
            contenedorDiv.classList.add('tarjeta');

            contenedorDiv.innerHTML = `
                <h2 class="titulo__tarjeta">${producto.nombre}</h2> 
                <img class="imagenes__tarjeta" src="${producto.imagen}" alt="">
            `;
            
            let color = document.createElement('p');
            let precio = document.createElement('p');
            color.textContent = 'Color: ' + producto.color; 
            precio.textContent = '$' + producto.precio;
            color.classList.add('color__tarjeta');
            precio.classList.add('precio');
            
            let botones = crearBotones();
            botones.dataset.id = producto.id;
            contenedorDiv.appendChild(color);
            contenedorDiv.appendChild(precio);
            contenedorDiv.appendChild(botones); 

            carritoFiltrado.appendChild(contenedorDiv);  
            carritoFiltrado.style.display='grid' 
            carritoCompras.style.display='none' 
            carritoInput.style.display='none' 
            informacion.style.display='none' 
            
        }); 

        carritoFiltrado.scrollIntoView({
            behavior:'smooth',
            block:'start'

        })
    } else { 
        todosLosProducts(); // Mostrar todos los productos si no hay resultados
    }
    
    activarBoton(); // Asegurarte de que los botones estén activados después de filtrar
});
