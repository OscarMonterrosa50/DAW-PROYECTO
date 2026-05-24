const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const pinIngresado = document.getElementById('pinInput').value;

        if (!pinIngresado || pinIngresado.length !== 4 || isNaN(pinIngresado)) {
            swal("Error", "El PIN debe tener exactamente 4 números.", "error");
            return;
        }

        if (pinIngresado === '0000') {
            swal("Acceso Administrador", "Redirigiendo al panel de control...", "success")
                .then(() => { window.location.href = 'admin.html'; });
            return;
        }

        const users = JSON.parse(localStorage.getItem(USERS_DB_KEY));
        const foundUser = users.find(u => u.pin === pinIngresado);

        if (foundUser) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
            swal(`¡Bienvenido, ${foundUser.name}!`, "Acceso Concedido", "success")
                .then(() => { window.location.href = 'dashboard.html'; });
        } else {
            swal("Acceso Denegado", "El PIN es incorrecto o el usuario no existe", "error");
        }
    });
}