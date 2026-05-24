document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminForm');
    
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('newName').value;
            const pin = document.getElementById('newPin').value;
            const balance = parseFloat(document.getElementById('newBalance').value);
            const users = JSON.parse(localStorage.getItem(USERS_DB_KEY));

            if (pin === '0000') {
                swal("PIN Inválido", "El PIN 0000 está reservado para el Administrador.", "error");
                return;
            }
            if (users.some(u => u.pin === pin)) {
                swal("PIN Duplicado", "Ese PIN ya está en uso por otro cliente. Elija uno distinto.", "error");
                return;
            }

            let currentAccountNumber = parseInt(localStorage.getItem(ACCOUNT_COUNTER_KEY));
            const newAccountString = currentAccountNumber.toString();

            const newUser = {
                name: name, pin: pin, account: newAccountString, balance: balance,
                transactions: [{ date: new Date().toLocaleString(), type: 'Depósito inicial', amount: balance, status: 'Completado' }]
            };

            users.push(newUser);
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
            localStorage.setItem(ACCOUNT_COUNTER_KEY, (currentAccountNumber + 1).toString());

            swal("¡Usuario Creado!", `Cliente: ${name}\nNúmero de Cuenta: ${newAccountString}\nPIN: ${pin}`, "success")
                .then(() => { adminForm.reset(); });
        });
    }
});