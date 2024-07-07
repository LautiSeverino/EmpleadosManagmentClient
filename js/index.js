document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const loginResponse = await login(username, password);

        if (loginResponse === 'Login successful!') {
            window.location.href = '../pages/empleados.html';
        } else {
            document.getElementById('loginResponse').innerText = loginResponse;
        }
    });
});



async function login(username, password) {
    try {
        const response = await fetch('https://www.apiblazorempleados.somee.com/api/Login/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UserName: username, UserPassword: password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const token = await response.text();
        localStorage.setItem('authToken', token);
        return 'Login successful!';
    } catch (error) {
        return error.message;
    }
}


