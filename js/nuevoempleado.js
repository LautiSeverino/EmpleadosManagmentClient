document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    await fetchDepartamentos();

    const form = document.getElementById('nuevoEmpleadoForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await createEmpleado();
    });
});

async function fetchDepartamentos() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://www.apiblazorempleados.somee.com/api/Departamento/GetAll', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }

        const departamentos = await response.json();
        populateDepartamentos(departamentos);
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateDepartamentos(departamentos) {
    const departamentoSelect = document.getElementById('departamento');
    departamentos.forEach(departamento => {
        const option = document.createElement('option');
        option.value = departamento.idDepartamento;
        option.textContent = departamento.nombre;
        departamentoSelect.appendChild(option);
    });
}

async function createEmpleado() {
    try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData(document.getElementById('nuevoEmpleadoForm'));
        const data = {
            nombreCompleto: formData.get('nombreCompleto'),
            idDepartamento: parseInt(formData.get('departamento')),
            sueldo: parseInt(formData.get('sueldo')),
            nroDocumento: formData.get('nroDocumento'),
            fechaContrato: formData.get('fechaContrato')
        };

        const response = await fetch('http://www.apiblazorempleados.somee.com/api/Empleado/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Ya existe un empleado con ese numero de documento")
            throw new Error('Failed to create employee');
        }

        window.location.href = 'empleados.html';
    } catch (error) {
        console.error('Error:', error);
    }
}
