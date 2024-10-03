

import { actualizarOverlay, actualizarValorTotal} from './carrito.js';
import { productosActualizados } from "./ActivarBotones.js";
import { botonReactivado } from './ReactivarBoton.js';



export function eliminarProducto() {
  let eliminarBoton = document.querySelectorAll('.eliminar__boton'); // Botones de eliminar en el carrito

  eliminarBoton.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', async () => {
      let idProducto = parseInt(botonEliminar.dataset.id);
      let producto = productosActualizados.find(p => p.id === idProducto); 
    

      if (producto) {
        // Disminuir cantidad si es mayor a 1 o eliminar producto si es 1
        if (producto.cantidad > 1) {
          producto.cantidad--;
          producto.stock++;
        } else {
          // Eliminar producto del carrito si la cantidad es 1
          productosActualizados.splice(productosActualizados.findIndex(p => p.id === idProducto), 1); 
          botonReactivado(idProducto)

          // Reactivar el botón de este producto específico en la interfaz
           
        }

        // Actualizar el servidor con el stock actualizado o eliminar el producto
        try {
          await fetch(`http://localhost:5000/carrito/productos/${idProducto}`, {
            method: producto.stock > 0 ? "PUT" : "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cantidad: producto.cantidad,
              stock: producto.stock
            })
          });
        } catch (err) {
          console.log("Error al recibir la respuesta del backend:", err.message);
        }

        // Guardar los productos actualizados en localStorage
        localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
        
        // Actualizar la interfaz del carrito
        actualizarOverlay();
        actualizarValorTotal();

        // Si el carrito está vacío, se puede manejar la reactivación general de botones
       
      }
    });
  });
}
