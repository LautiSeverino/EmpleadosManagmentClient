document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const newEmployeeBtn = document.getElementById('newEmployeeBtn');
    const searchBtn = document.getElementById('searchBtn');

    newEmployeeBtn.addEventListener('click', () => {
        window.location.href = '../pages/nuevoempleado.html';
    });

    searchBtn.addEventListener('click', async () => {
        const searchInput = document.getElementById('searchInput').value.trim();

        if (searchInput.length === 0) {
            await fetchEmployees();
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            let searchUrl = '';

            // Check if searchInput is numeric (assumed to be a nroDocumento)
            if (!isNaN(searchInput)) {
                searchUrl = `http://www.apiblazorempleados.somee.com/api/Empleado/GetByNroDocumento/${searchInput}`;
            } else {
                searchUrl = `http://www.apiblazorempleados.somee.com/api/Empleado/GetByNombre/${searchInput}`;
            }

            const response = await fetch(searchUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const result = await response.json();

            if (Array.isArray(result)) {
                populateEmployeeTable(result);
            } else if (result && !Array.isArray(result)) {
                populateEmployeeTable([result]); 
            } else {
                const employeeTable = document.getElementById('employeeTable').querySelector('tbody');
                employeeTable.innerHTML = '';
                const row = employeeTable.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 6;
                cell.textContent = 'No employees found';
            }
        } catch (error) {
            alert('No se encontraron empleados');
        }
    });

    await fetchEmployees();
});

async function fetchEmployees() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://www.apiblazorempleados.somee.com/api/Empleado/GetAll', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }

        const employees = await response.json();
        populateEmployeeTable(employees);
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateEmployeeTable(employees) {
    const employeeTable = document.getElementById('employeeTable').querySelector('tbody');
    employeeTable.innerHTML = '';

    if (!employees || employees.length === 0) {
        const row = employeeTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = 'No employees found';
        return;
    }

    employees.forEach(employee => {
        const row = employeeTable.insertRow();
        row.insertCell(0).textContent = employee.nombreCompleto;
        row.insertCell(1).textContent = employee.idDepartamentoNavigation.nombre;
        row.insertCell(2).textContent = employee.sueldo;
        row.insertCell(3).textContent = employee.nroDocumento;
        row.insertCell(4).textContent = new Date(employee.fechaContrato).toLocaleDateString();

        const actionsCell = row.insertCell(5);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteEmployee(employee.nroDocumento));
        actionsCell.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editEmployee(employee.nroDocumento));
        actionsCell.appendChild(editButton);
    });
}

function editEmployee(nroDocumento) {
    window.location.href = `editarempleado.html?nroDocumento=${nroDocumento}`;
}

async function deleteEmployee(nroDocumento) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://www.apiblazorempleados.somee.com/api/Empleado/Delete/${nroDocumento}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }

        await fetchEmployees();
    } catch (error) {
        console.error('Error:', error);
    }
}
