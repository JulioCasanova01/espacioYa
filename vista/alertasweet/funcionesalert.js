
function contactanos() {
  Swal.fire({
  title: "Atención Registrada!",
  icon: "success",
  draggable: true
  });
}


function confirmar(texto, opcion_si, opcion_no, icono) {
  return Swal.fire({
    title: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: opcion_si,
    cancelButtonText: opcion_no
  }).then((result) => {
    return result.isConfirmed;
  });
}


function informar(texto, boton, redireccion,icono) {
  Swal.fire({
    title: texto,
    icon: icono,
    showCancelButton: false,
    confirmButtonText: boton,
    allowOutsideClick: false,  
    allowEscapeKey: false,  
    allowEnterKey: false, 
  }).then((result) => {
      window.location.href = redireccion;
  });
}

  
