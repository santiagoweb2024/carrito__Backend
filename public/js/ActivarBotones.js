import { actualizarOverlay, actualizarValorTotal, iconCart } from "./carrito.js";
import { actualizarBoton } from "./ActualizarBoton.js"


export let productosActualizados = localStorage.getItem('Productos-Actualizados') ? JSON.parse(localStorage.getItem('Productos-Actualizados')) : [];
let carritoID = [];

async function obtenerID() {

  try {
    let response = await fetch(`http://localhost:5000/carrito/productos`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })

    let data = await response.json()

    carritoID = data


  }

  catch (err) {
    console.log(`no se obtuvieron los productos`, err.message)
  }

}






export async function activarBoton() {
  let botones = document.querySelectorAll('.botones__agregar');
  await obtenerID()

  botones.forEach((button) => {
    // Eliminar event listeners anteriores
    button.removeEventListener('click', botonesActivados);

    // Agregar nuevo event listener
    button.addEventListener('click', botonesActivados);
  });
}

async function botonesActivados(e) {

  let botonClickeado = e.target.dataset.id

  let productoSeleccionado = carritoID.find(elemento => elemento.id == botonClickeado);
  console.log(productoSeleccionado)
  let productoExistente = productosActualizados.find(el => el.id === parseInt(botonClickeado));
  console.log(productoExistente)

  if (productoSeleccionado) {
    if (productoSeleccionado.stock > 0) {
      if (productoExistente) {
        if (productoExistente.cantidad < 10000) {
          productoExistente.cantidad++;
          console.log(productoExistente)
          productoSeleccionado.stock--;
          productoExistente.stock = productoSeleccionado.stock;

        }
      } else {
        productosActualizados.push({ ...productoSeleccionado, cantidad: 1, stock: productoSeleccionado.stock });
        productoSeleccionado.stock--;

      }
      console.log("carritoID:", carritoID);
      console.log("productoSeleccionado:", productoSeleccionado);
      console.log("productoExistente:", productoExistente);


      try {

        let response = await fetch(`http://localhost:5000/carrito/productos/${productoSeleccionado.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cantidad: productoExistente ? productoExistente.cantidad : 1,
            stock: productoExistente?.stock
          })
        })
        if (!response.ok) {
          throw new Error("no se pudo modificar");

        }

      }
      catch (err) {
        console.log("error al recibir la respuesta del backend", err.message)
      }

      let cantidadTotal = productosActualizados.reduce((total, prod) => total + prod.cantidad, 0);
      iconCart.innerHTML = productosActualizados.reduce((total, prod) => total + prod.cantidad, 0);

      localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
      actualizarValorTotal();
      actualizarOverlay();

      if (productoSeleccionado.stock === 0) {
        actualizarBoton(productoSeleccionado);
      }



    }


  }
}
