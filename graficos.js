document.addEventListener('DOMContentLoaded', function() {
    const chartCanvas = document.getElementById('transactionChart');
    
    if (chartCanvas) {
        const user = getUserData();
        
        // Si no hay usuario logueado, lo regresamos al login
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const typeCounts = {};

        // Contar cuántas transacciones hay de cada tipo
        user.transactions.forEach(t => {
            typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
        });

        // Configurar y dibujar la gráfica con Chart.js
        new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(typeCounts),
                datasets: [{
                    label: 'Cantidad de Transacciones',
                    data: Object.values(typeCounts),
                    backgroundColor: [
                        '#ffcb05', // Amarillo Pokémon
                        '#2a75bb', // Azul Pokémon
                        '#ff0000', // Rojo Pokéball
                        '#4caf50', // Verde
                        '#9c27b0', // Morado
                        '#ff9800', // Naranja
                        '#607d8b'  // Gris
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { position: 'right' } 
                }
            }
        });
    }
});