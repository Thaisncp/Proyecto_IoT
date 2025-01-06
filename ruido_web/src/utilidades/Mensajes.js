import swal from 'sweetalert';

const mensajes = (texto, type='success', title='OK') => swal({
    title: title,
    text: texto,
    icon: type,
    button: 'OK',
    timer: 2500,
    closeOnEsc: true
  });
export default mensajes;