// Declarar variables globales
let nombre, precio, diasCaducidad, total = 0;

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

// // Definir la función calcular (SIN REFACTORIZAR)
// function calcular(producto, cantidad) {
//     if (producto instanceof Perecedero) {
//       if (producto.diasParaCaducar == 3) {
//         const descuento = producto.precio * cantidad * 0.25;
//         const precioFinal = producto.precio * cantidad - descuento;
//         return {descuento: descuento, precioFinal: precioFinal};
//       } else if (producto.diasParaCaducar == 2) {
//         const descuento = producto.precio * cantidad * 0.33;
//         const precioFinal = producto.precio * cantidad - descuento;
//         return {descuento: descuento, precioFinal: precioFinal};
//       } else if (producto.diasParaCaducar == 1) {
//         const descuento = producto.precio * cantidad * 0.5;
//         const precioFinal = producto.precio * cantidad - descuento;
//         return {descuento: descuento, precioFinal: precioFinal};
//       }
//     }
//     const precioFinal = producto.precio * cantidad;
//     return {descuento: 0, precioFinal: precioFinal};
//   }
  
// Definir la función calcular (REFACTORIZADA con SWITCH)
function calcular(producto, cantidad) {
    let descuento = 0;
    let precioFinal = producto.precio * cantidad;
  
    if (producto instanceof Perecedero) {
      switch (producto.diasParaCaducar) {
        case 3:
          descuento = precioFinal * 0.25;
          break;
        case 2:
          descuento = precioFinal * 0.33;
          break;
        case 1:
          descuento = precioFinal * 0.5;
          break;
      }
      precioFinal -= descuento;
    }
  
    return { descuento: descuento, precioFinal: precioFinal };
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
      producto = new Perecedero(parseFloat(precio), parseInt(diasCaducidad));
    } else {
      producto = { precio: parseFloat(precio) };
    }

    // Llamar a la función calcular y agregar el resultado a la tabla
    const cantidad = 1; // Cantidad por defecto
    const precioCalculado = calcular(producto, cantidad);
    if (!isNaN(precioCalculado.precioFinal)) {
      total = total || 0;
      total += precioCalculado.precioFinal;
      const totalElem = document.querySelector('#total');
      totalElem.innerHTML = `<strong>${total.toFixed(2)}€</strong>`;

      let descuento;
      let pvp;
      if (diasCaducidad !== "0") {
        descuento = precioCalculado.descuento;
        pvp = precioCalculado.precioFinal.toFixed(2);
      } else {
        descuento = 0;
        pvp = parseFloat(precio).toFixed(2);
      }

      const row = `<tr><td>${nombre}</td><td>${parseFloat(precio).toFixed(2)}€</td><td>${diasCaducidad}</td><td>${descuento.toFixed(2)}€</td><td>${pvp}€</td></tr>`;
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
