window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nroDocumento = urlParams.get('nroDocumento');

    if (nroDocumento) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`http://apiblazorempleados.somee.com/api/Empleado/GetByNroDocumento/${nroDocumento}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employee data');
            }

            const empleado = await response.json();

            // Populate form fields with employee data
            document.getElementById('nombreCompleto').value = empleado.nombreCompleto;
            document.getElementById('idDepartamento').value = empleado.idDepartamento;
            document.getElementById('sueldo').value = empleado.sueldo;
            document.getElementById('fechaContrato').value = empleado.fechaContrato.slice(0, 10); 
        } catch (error) {
            console.error('Error fetching:', error);
        }
    } else {
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('http://apiblazorempleados.somee.com/api/Departamento/GetAll', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }

        const departamentos = await response.json();

        const selectDepartamento = document.getElementById('idDepartamento');
        departamentos.forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.idDepartamento;
            option.textContent = depto.nombre;
            selectDepartamento.appendChild(option);
        });
    } catch (error) {
    }

    // Handle form submission as before
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    editEmployeeForm.onsubmit = async function(event) {
        event.preventDefault();

        const formData = new FormData(editEmployeeForm);
        const empleadoData = {
            nombreCompleto: formData.get('nombreCompleto'),
            idDepartamento: parseInt(formData.get('idDepartamento')),
            sueldo: parseInt(formData.get('sueldo')),
            nroDocumento: nroDocumento,
            fechaContrato: new Date(formData.get('fechaContrato')).toISOString(),
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`http://apiblazorempleados.somee.com/api/Empleado/Update/${nroDocumento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(empleadoData),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            window.location.href = 'empleados.html';
        } catch (error) {
        }
    };
};
