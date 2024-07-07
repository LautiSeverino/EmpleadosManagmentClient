document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    await fetchDepartamentos();
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
        populateDepartamentoTable(departamentos);
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateDepartamentoTable(departamentos) {
    const departamentoTable = document.getElementById('departamentoTable').querySelector('tbody');
    departamentoTable.innerHTML = '';

    if (departamentos.length === 0) {
        const row = departamentoTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.textContent = 'No departments found';
        return;
    }

    departamentos.forEach(departamento => {
        const row = departamentoTable.insertRow();
        row.insertCell(0).textContent = departamento.idDepartamento;
        row.insertCell(1).textContent = departamento.nombre;

    });
}



