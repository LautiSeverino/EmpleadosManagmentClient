window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nroDocumento = urlParams.get('nroDocumento');

    if (nroDocumento) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`https://apiblazorempleados.somee.com/api/Empleado/GetByNroDocumento/${nroDocumento}`, {
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
            
            // Convert the date from dd/MM/yyyy to YYYY-MM-DD
            const formattedDate = formatDateForInput(empleado.fechaContrato);
            document.getElementById('fechaContrato').value = formattedDate;
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('https://apiblazorempleados.somee.com/api/Departamento/GetAll', {
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
        console.error('Error fetching departments:', error);
    }

    const editEmployeeForm = document.getElementById('editEmployeeForm');
    editEmployeeForm.onsubmit = async function(event) {
        event.preventDefault();

        const formData = new FormData(editEmployeeForm);
        const empleadoData = {
            nombreCompleto: formData.get('nombreCompleto'),
            idDepartamento: parseInt(formData.get('idDepartamento')),
            sueldo: parseInt(formData.get('sueldo')),
            nroDocumento: nroDocumento,
            fechaContrato: formData.get('fechaContrato'),
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`https://apiblazorempleados.somee.com/api/Empleado/Update/${nroDocumento}`, {
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

            window.location.href = '../pages/empleados.html';
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    function formatDateForInput(dateString) {
        // Convert dd/MM/yyyy to YYYY-MM-DD
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }
};
