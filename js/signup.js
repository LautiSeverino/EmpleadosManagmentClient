document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newUsername = document.getElementById('newUsername').value;
        const newUserEmail = document.getElementById('newUserEmail').value;
        const newUserPhone = document.getElementById('newUserPhone').value;
        const newPassword = document.getElementById('newPassword').value;

        const registerResponse = await register(newUsername, newUserEmail, newUserPhone, newPassword);
        if (registerResponse === 'Registration successful!') {
            window.location.href = 'login.html';
        } else {
            document.getElementById('registerResponse').innerText = registerResponse;
        }
    });
});

async function register(username, email, phone, password) {
    try {
        const response = await fetch('https://www.apiblazorempleados.somee.com/api/Login/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UserName: username, UserEmail: email, UserPhone: phone, UserPassword: password })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return 'Registration successful!';
    } catch (error) {
        return error.message;
    }
}
