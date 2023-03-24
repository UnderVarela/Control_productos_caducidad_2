// Declarar variables globales
let nombre, precio, diasCaducidad, total;

// Función para validar el formulario
function validarForm() {
  nombre = document.querySelector('#nombre').value;
  precio = document.querySelector('#precio').value;
  diasCaducidad = document.querySelector('select[name="select"]').value;

  const regex = /^[a-zA-Z0-9ñÑ]+$/;
  const regexPrecio = /^\d+(\.\d{1,2})?€?$/;

  if (!regex.test(nombre)) {
    dialog.showModal();
    dialog.querySelector('p').textContent = 'El campo de nombre solo debe contener caracteres alfanuméricos';
    return false;
  }

  if (!regexPrecio.test(precio)) {
    dialog.showModal();
    dialog.querySelector('p').textContent = 'El campo de precio debe estar en formato 13€ o 13.5€';
    return false;
  }

  return true;
}

// Definir la clase Perecedero
class Perecedero {
  constructor(precio, diasParaCaducar) {
    this.precio = precio;
    this.diasParaCaducar = diasParaCaducar;
  }
}

// Definir la función calcular
function calcular(producto, cantidad) {
  if (producto instanceof Perecedero) {
    if (producto.diasParaCaducar == 3) {
      return producto.precio * cantidad * 0.25;
    } else if (producto.diasParaCaducar == 2) {
      return producto.precio * cantidad * 0.33;
    } else if (producto.diasParaCaducar == 1) {
      return producto.precio * cantidad * 0.5;
    }
  }
  return producto.precio * cantidad;
}

// Agregar evento al submit
const form = document.querySelector('#formulario');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const isValid = validarForm();
  if (isValid) {
    const tbody = document.querySelector('#tbody');
    nombre = document.querySelector('#nombre').value;
    precio = document.querySelector('#precio').value;
    diasCaducidad = document.querySelector('select[name="select"]').value;

    // Crear una instancia de la clase Perecedero o simplemente usar el precio si el valor de diasCaducidad es 0
    let producto;
    if (diasCaducidad !== "0") {
      producto = new Perecedero(precio, diasCaducidad);
    } else {
      producto = { precio: precio };
    }

    // Llamar a la función calcular y agregar el resultado a la tabla
    const cantidad = 1; // Cantidad por defecto
    const precioCalculado = calcular(producto, cantidad);
    if (!isNaN(precioCalculado)) {
      total = total || 0;
      total += precioCalculado;
      const totalElem = document.querySelector('#total');
      totalElem.innerHTML = `<strong>${total.toFixed(2)}€</strong>`;

      
      let descuento;
      let pvp;
      if (diasCaducidad !== "0") {
        descuento = precio - precioCalculado;
        pvp = precioCalculado.toFixed(2);
      } else {
        descuento = 0;
        pvp = precio;
      }

      const row = `<tr><td>${nombre}</td><td>${precio}€</td><td>${diasCaducidad}</td><td>${descuento.toFixed(2)}</td><td>${pvp}€</td></tr>`;
      tbody.innerHTML += row;
          
          }
    }
});

const btnLimpiar = document.querySelector('#limpiar');
btnLimpiar.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#nombre').value = '';
  document.querySelector('#precio').value = '';
  document.querySelector('select[name="select"]').selectedIndex = 0;
});

