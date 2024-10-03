const path = require("path")
const fs = require("fs")

const formatProducts = () => {
  try {
    let carrito = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../public/js/carrito.json"), "utf-8")
    );
    carrito = carrito.map((producto, index) => {
      return { id: index, ...producto, cantidad: 0 };
    });
    fs.writeFileSync(
      path.join(__dirname, "../public/js/carrito.json"),
      JSON.stringify(carrito, null, 2)
    );
  } catch (error) {
    console.error(error.message);
  }
};

formatProducts(); 