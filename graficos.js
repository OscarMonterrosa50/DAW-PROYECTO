document.addEventListener('DOMContentLoaded', function() {
    const chartCanvas = document.getElementById('transactionChart');
    
    if (chartCanvas) {
        const user = getUserData();
        
        
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const typeCounts = {};

        user.transactions.forEach(t => {
            typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
        });

        new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(typeCounts),
                datasets: [{
                    label: 'Cantidad de Transacciones',
                    data: Object.values(typeCounts),
                    backgroundColor: [
                        '#ffcb05', '#2a75bb', '#ff0000', '#4caf50', '#9c27b0', '#ff9800', '#607d8b'
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