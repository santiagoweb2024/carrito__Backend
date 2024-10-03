const express = require("express");
const path = require("path");
const fs = require("fs").promises; // Usamos la versión de promesas de fs
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function obtenerProductos() {
    const productos = JSON.parse(
        await fs.readFile(path.join(__dirname, "../public/js/carrito.json"), "utf-8")
    );
    return productos;
}

// Función para recargar el stock de los productos a su cantidad inicial
async function recargarStock() {
    let productos = await obtenerProductos();
    let stockRecargado = false;

    productos.forEach(producto => {
        if (producto.stock === 0) {
            producto.stock = producto.cantidad; // Restablecer el stock a la cantidad inicial
            stockRecargado = true; // Indicar que se ha recargado el stock
        }
    });

    // Solo guardar si se ha realizado algún cambio
    if (stockRecargado) {
        await fs.writeFile(path.join(__dirname, "../public/js/carrito.json"), JSON.stringify(productos, null, 2));
    }
}

const port = 5000;



app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

// Ruta para obtener la página principal
app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Obtener todos los productos
app.get("/carrito/productos", async (req, res) => {
    try {
        await recargarStock(); // Recargar stock antes de enviar los productos
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        console.error("Error al leer los productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Agregar producto al carrito
app.post("/carrito/productos", async (req, res) => {
    try {
        const { id, cantidad, stock } = req.body; 

        let productos = await obtenerProductos();
        const productoExistente = productos.find(p => p.id === id);

        if (!productoExistente) {
            const nuevoProducto = { id, cantidad, stock };
            productos.push(nuevoProducto);

            // Guardar el nuevo producto en el archivo
            await fs.writeFile(path.join(__dirname, "../public/js/carrito.json"), JSON.stringify(productos, null, 2));

            res.status(201).json({ mensaje: "Producto agregado correctamente", producto: nuevoProducto });
        } else {
            res.status(400).json({ error: "El producto ya existe" });
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

// Actualizar un producto existente en el carrito
app.put("/carrito/productos/:id", async (req, res) => {
    try {
        const idProducto =parseInt( req.params.id);
        const { cantidad, stock } = req.body;

        let productos = await obtenerProductos();
        const producto = productos.find(p => p.id === idProducto);

        if (producto) {
            producto.cantidad = cantidad;
            producto.stock = stock;

            // Guardar los productos actualizados en el archivo
            await fs.writeFile(path.join(__dirname, "../public/js/carrito.json"), JSON.stringify(productos, null, 2));

            res.json({ mensaje: "Producto actualizado correctamente", producto });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// Eliminar un producto del carrito
app.delete("/carrito/productos/:id", async (req, res) => {
    try {
        const idProducto = parseInt( req.params.id);

        let productos = await obtenerProductos();
        const indiceProducto = productos.findIndex(p => p.id === idProducto);

        if (indiceProducto !== -1) {
            productos.splice(indiceProducto, 1); // Eliminar el producto del array

            // Guardar los productos actualizados en el archivo
            await fs.writeFile(path.join(__dirname, "../public/js/carrito.json"), JSON.stringify(productos, null, 2));

            res.json({ mensaje: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

app.listen(port, () => {
    console.log(`Se está escuchando en el puerto: ${port}`);
});
