const correo = document.getElementById('inpt_correo');
const nombre = document.getElementById('inpt_nombre');
const telefono = document.getElementById('inpt_telefono');
const tbody = document.getElementById('users');

const btnEnviarDatos = document.getElementById('btn_enviar');
const btnLimpiarDatos = document.getElementById('btn_limpiar');
const btnActualizarDatos = document.getElementById('btn_actualizar');

let indexUser;
let isUpdating = false;

btnLimpiarDatos.addEventListener('click', e => {
    let sure = confirm('¿Estás seguro que quieres limpiar la base de datos?');
    if(sure) {
        localStorage.clear();
        tbody.innerHTML = '';
        localStorage.setItem('counter',0);
    };
}); 


if(!localStorage.getItem('counter')) {
    localStorage.setItem('counter',0);
    tbody.innerHTML = '';
};

btnEnviarDatos.addEventListener('click', e => {
    e.preventDefault();
    if(validForm()) {
        try {
            localStorage.setItem(`user${localStorage.getItem('counter')}`,JSON.stringify({
                correo : correo.value,
                nombre : nombre.value,
                telefono : telefono.value
            }));
        } catch (e) {
            if (e.code === 'QUOTA_EXCEEDED_ERR' || e.name === 'QuotaExceededError') {
                alert('El localStorage está lleno');
            }
        }
        readData();
        localStorage.setItem('counter',parseInt(localStorage.getItem('counter')) + 1);
        correo.value = '';
        nombre.value = '';
        telefono.value = '';
    } else {
        alert('El formulario es inválido, rellene los campos correctamente');
    };
});

btnActualizarDatos.addEventListener('click', () => {
    localStorage.setItem(`user${indexUser}`,JSON.stringify({
        correo : correo.value,
        nombre : nombre.value,
        telefono : telefono.value
    }));
    readData();
    correo.value = '';
    nombre.value = '';
    telefono.value = '';
    btnActualizarDatos.classList.replace('inline','hidden');
    btnEnviarDatos.classList.replace('hidden','inline');
    btnLimpiarDatos.classList.replace('hidden','inline');
    isUpdating = false;
}); 

const validForm = () => {
    let emailPattern = /[a-zA-Z0-9]+@\w+.\w+/g;
    if(!emailPattern.test(correo.value)) return false;
    if(nombre.value.length < 4) return false;
    return true
};

const deleteData = index => {
    localStorage.removeItem(`user${index}`);
    tbody.innerHTML = '';
    readData();
    if(isUpdating) {
        btnActualizarDatos.classList.replace('inline','hidden');
        btnEnviarDatos.classList.replace('hidden','inline');
        btnLimpiarDatos.classList.replace('hidden','inline');
        correo.value = '';
        nombre.value = '';
        telefono.value = '';
        isUpdating = false;
    };
};

const updateData = index => {
    const user = JSON.parse(localStorage.getItem(`user${index}`));
    correo.value = user.correo;
    nombre.value = user.nombre;
    telefono.value = user.telefono;
    btnActualizarDatos.classList.replace('hidden','inline');
    btnEnviarDatos.classList.replace('inline','hidden');
    btnLimpiarDatos.classList.replace('inline','hidden');
    indexUser = index;  
    isUpdating = true;
};  

const readData = () => {
    tbody.innerHTML = '';
    for(let i = 0; i <= parseInt(localStorage.getItem('counter')); i++) {
        const tr = document.createElement('TR');
        const td1 = document.createElement('TD');
        const td2 = document.createElement('TD');
        const td3 = document.createElement('TD');
        const td4 = document.createElement('TD');
        const button1 = document.createElement('BUTTON');
        const button2 = document.createElement('BUTTON');
        const div = document.createElement('DIV');

        let data = JSON.parse(localStorage.getItem(`user${i}`));
        if(data) {
            td1.textContent = data.correo;
            td2.textContent = data.nombre;
            td3.textContent = data.telefono;
            button1.textContent = 'Eliminar usuario';
            button2.textContent = 'Actualizar usuario';

            td1.className = 'border-2 pl-2 pr-0';
            td2.className = 'border-2 pl-2 pr-0';
            td3.className = 'border-2 pl-2 pr-0';
            td4.className = 'border-2 pl-2 pr-0';
            button1.className = 'text-white bg-red-600 py-2 px-4 hover:bg-red-900 rounded-sm transition-colors duration-200';
            button2.className = 'text-white bg-orange-600 py-2 px-4 sm:ml-2 hover:bg-orange-900 rounded-sm transition-colors duration-200';
            div.className = 'w-full h-full flex justify-center'

            button1.setAttribute('onclick',`deleteData(${i})`);
            button2.setAttribute('onclick',`updateData(${i})`);

            div.appendChild(button1);
            div.appendChild(button2);

            td4.appendChild(div);

            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tbody.appendChild(tr);
        }
    };
};

readData();
