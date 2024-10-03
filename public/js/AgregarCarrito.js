import { iconCart, actualizarOverlay, actualizarValorTotal } from "./carrito.js"; 
import { productosActualizados } from "./ActivarBotones.js";
import {actualizarBoton} from "./ActualizarBoton.js"


export function agregarProducto() {  
  let agregarBoton = document.querySelectorAll('.agregar__boton');

  agregarBoton.forEach(botonAgregar => {
    botonAgregar.addEventListener('click', async (e) => { 

      let idProducto = Number(botonAgregar.dataset.id); 
      console.log(idProducto)
      let producto = productosActualizados.find(p => p.id === idProducto); 
      console.log(producto.id)

      // Verificar si el producto tiene stock disponible
      if (producto && producto.stock > 0) {
        producto.stock--;    // Reducimos el stock disponible 

        console.log(producto.stock)
      

        if (producto.stock === 0) {   
       
          actualizarBoton(producto)  
          
        }   

        
        else {
          producto.cantidad++; // Si aún queda stock, incrementamos la cantidad
        } 

          fetch(`http://localhost:5000/carrito/productos/${idProducto}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cantidad: producto.cantidad, stock: producto.stock })
      }).then(response => {
          if (!response.ok) throw new Error('Error al actualizar el producto');
          return response.json();
      })
       .then(response=>{
        console.log(response)
       })
      .catch(error => console.log("Error en la API:", error));
      
        // Actualizamos el icono del carrito con la nueva cantidad
        iconCart.innerHTML = producto.cantidad;
        localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));

        actualizarOverlay();
        actualizarValorTotal();

      } else {
        // Si no hay stock, evitar cualquier acción
        Toastify({
          text: 'Este producto ya no está disponible en stock',
          duration: 3000,
          close: true,
          gravity: "top", 
          position: "center", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #ff5722, #f44336)",
            borderRadius: "2rem", 
            padding: "2rem 4rem", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textTransform: "uppercase",
            fontSize: "1.5rem"
          },
          offset: {
            x: 0, 
            y: '8rem' 
          }
        }).showToast();
        
        botonAgregar.innerHTML = 'Sin stock';
        botonAgregar.disabled = true;
      }
    });
  });
}

