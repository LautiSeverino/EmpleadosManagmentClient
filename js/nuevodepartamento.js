document.getElementById('newDepartmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://www.apiblazorempleados.somee.com/api/Departamento/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre })
        });

        if (!response.ok) {
            throw new Error('Failed to create department');
        }

        alert('Departamento creado con éxito');
        window.location.href = '../pages/departamentos.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el departamento');
    }
});
