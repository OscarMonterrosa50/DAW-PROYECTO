document.addEventListener('DOMContentLoaded', function() {
    const historyTableBody = document.getElementById('historyTableBody');
    
    if (historyTableBody) {
        const user = getUserData();
        
        // Si no hay usuario logueado, lo regresamos al login
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        historyTableBody.innerHTML = ''; 

        // Invertimos el arreglo para mostrar la transacción más reciente primero
        const reversedTransactions = [...user.transactions].reverse();

        reversedTransactions.forEach(t => {
            const tr = document.createElement('tr');
            const isPositive = t.amount >= 0;
            const amountClass = isPositive ? 'text-success' : 'text-danger';
            const sign = isPositive ? '+' : '';

            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.type}</td>
                <td class="${amountClass}"><strong>${sign}$${Math.abs(t.amount).toFixed(2)}</strong></td>
                <td><span class="badge badge-success">${t.status}</span></td>
            `;
            historyTableBody.appendChild(tr);
        });
    }
});