import { obtenerInformacion, subirInformacion } from "../admin/js/prueba.js";
let btnAceptar = document.getElementById("aceptar");
let btnEliminar = document.getElementById("eliminar");
let btnLimpiar = document.getElementById("limpiar");

btnAceptar.addEventListener("click", (e) => {
  e.preventDefault();
  let usuario = verificarUsuario();
  let nombre = verificarNombre();
  let correo = verificarCorreo();
  let password = verificarPassword();
  let edad = verificarEdad();

  if (usuario && nombre && correo && password && edad) {
    registrarUsuario();
  }
});

btnLimpiar.addEventListener("click", (e) => {
  e.preventDefault();
  borrarCampos();
});

function borrarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("email").value = "";
  document.getElementById("contraseña").value = "";
  document.getElementById("contraseña2").value = "";
  document.getElementById("usuario").value = "";
}

btnEliminar.addEventListener("click", (e) => {
  e.preventDefault();
  eliminarUsuarios();
});

async function registrarUsuario() {
  let nombre = document.getElementById("nombre").value;
  let edad = document.getElementById("edad").value;
  let email = document.getElementById("email").value;
  let contrasena = document.getElementById("contraseña").value;
  let usuario = document.getElementById("usuario").value;

  const horaActual = new Date();
  const idUsuario = horaActual.getTime();

  try {
    const existeUsuario = await obtenerInformacion(
      "Usuarios",
      "usuario",
      usuario
    );

    if (existeUsuario) {
      mostrarModal(
        "Ese nombre de usuario ya esta en uso, usa otro porfavor",
        "mal",
        "mensaje-validacion",
        "mensaje-validacion"
      );
    } else {
      mostrarModal("Usuario registrado correctamente");
      // Crear un objeto con los datos obtenidos
      enviarCorreo(idUsuario);

      // await subirInformacion(
      //   "Usuarios",
      //   nombre,
      //   null,
      //   idUsuario,
      //   edad,
      //   contrasena,
      //   usuario,
      //   email
      // );

      // setTimeout(() => {
      //   window.location.href = "../html/login.html"; // Cambia esto por la ruta de tu página principal
      // }, 250);
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}

function eliminarUsuarios() {
  localStorage.clear();
  alert("Los usuarios se han eliminado correctamente");
}

function mostrarModal(mensaje, operacion) {
  var mensajeDiv = document.getElementById("mensajeDiv");
  mensajeDiv.style.display = "block";

  if (operacion) {
    mensajeDiv.classList.add("mal", "mensaje-validacion");
  } else {
    mensajeDiv.classList.add("bien");
  }

  mensajeDiv.innerText = mensaje;

  setTimeout(function () {
    mensajeDiv.style.display = "none";
    if (mensajeDiv.classList.contains("bien")) {
      mensajeDiv.classList.remove("bien");
    }
    mensajeDiv.classList.remove("mal", "mensaje-validacion");
  }, 3000); // 2000 milisegundos = 2 segundos
}

function verificarNombre() {
  const nombreRegex = /^[a-zA-Z\s]+$/;
  const nombreInput = document.getElementById("nombre");
  let validar = nombreRegex.test(nombreInput.value);
  if (!validar) {
    mostrarModal(
      "El nombre del usuario no es correcto",
      "mal",
      "mensaje-validacion"
    );
    return false;
  } else {
    return true;
  }
}

function verificarUsuario() {
  const usuarioRegex = /^[a-zA-Z0-9]{5,}$/;
  const usuarioInput = document.getElementById("usuario");
  let validar = usuarioRegex.test(usuarioInput.value);
  if (!validar) {
    mostrarModal("El usuario no es correcto", "mal", "mensaje-validacion");
    return false;
  } else {
    return true;
  }
}

function verificarEdad() {
  const edadRegex = /^(0*[1-9]|[1-9][0-9])$/;
  const edadInput = document.getElementById("edad");
  let validar = edadRegex.test(edadInput.value);
  if (!validar) {
    mostrarModal("La edad es incorrecta", "mal", "mensaje-validacion");
    return false;
  } else {
    return true;
  }
}

function verificarCorreo() {
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const correoInput = document.getElementById("email");
  let validar = correoRegex.test(correoInput.value);
  if (!validar) {
    mostrarModal(
      "El correo no es un correo valido",
      "mal",
      "mensaje-validacion"
    );
    return false;
  } else {
    return true;
  }
}

function verificarPassword() {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  const passwordInput = document.getElementById("contraseña");
  const passwordInput2 = document.getElementById("contraseña2");
  let pass = [passwordInput, passwordInput2];
  let ahuevo = false;
  if (passwordInput.value === passwordInput2.value) {
    pass.forEach((p) => {
      let validar = passwordRegex.test(p.value);
      if (!validar) {
        mostrarModal(
          "La contraseña debe contener 1 mayuscula, 1 caracter especial y al menos 1 numero",
          "mal",
          "mensaje-validacion"
        );
      } else {
        ahuevo = true;
      }
    });
  } else {
    mostrarModal(
      "Las contraseñas no coinciden, verificalas por favor",
      "mal",
      "mensaje-validacion"
    );
    return false;
  }

  return ahuevo;
}

function enviarCorreo(id) {
  // Reemplaza 'tu_template_ID' con tu Template ID de EmailJS

  // Obtener la URL actual

  let idEncriptado = cifradoCesar(toString(id), 3);

  let urlActual = window.location.href + `?id=${idEncriptado}`;

  // Verificar si la URL termina con "registrarse.html"
  if (urlActual.endsWith("registrarse.html")) {
    // Reemplazar "registrarse.html" con "login.html"
    urlActual = urlActual.replace("registrarse.html", "login.html");
  }

  const serviceID = "default_service";
  const templateID = "template_ryp16yk";
  const message = `Da click en este enlace para validar el registro: ${urlActual}`;

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("email").value;

  emailjs
    .send(serviceID, templateID, {
      to_name: nombre,
      reply_to: correo,
      message: message,
    })
    .then(
      () => {
        alert("¡Correo enviado correctamente!");
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
}

function cifradoCesar(texto, clave) {
  var textoEncriptado = '';
  for (var i = 0; i < texto.length; i++) {
      var charCode = texto.charCodeAt(i);
      if (charCode !== 32) { // Ignorar espacios
          if (charCode >= 65 && charCode <= 90) {
              textoEncriptado += String.fromCharCode(((charCode - 65 + clave) % 26) + 65); // Para letras mayúsculas
          } else if (charCode >= 97 && charCode <= 122) {
              textoEncriptado += String.fromCharCode(((charCode - 97 + clave) % 26) + 97); // Para letras minúsculas
          } else {
              textoEncriptado += texto.charAt(i); // Mantener caracteres no alfabéticos sin cambios
          }
      }
  }
  return textoEncriptado;
}
