function updateBalanceDisplay() {
    const lblBalance = document.getElementById('lblBalance');
    if (lblBalance) {
        const user = getUserData();
        if (user) {
            lblBalance.textContent = `$${user.balance.toFixed(2)}`;
        }
    }
}

function generatePDF(transaction) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(42, 117, 187); doc.text("Pokémon Bank", 20, 20);
    doc.setFontSize(16); doc.setTextColor(0, 0, 0); doc.text("Comprobante de Transacción", 20, 30);
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${transaction.date}`, 20, 50);
    doc.text(`Tipo de Transacción: ${transaction.type}`, 20, 60);
    doc.text(`Monto: $${Math.abs(transaction.amount).toFixed(2)}`, 20, 70);
    doc.text(`Estado: ${transaction.status}`, 20, 80);
    doc.save(`Comprobante_${transaction.type.replace(/\s+/g, '')}.pdf`);
}

function processTransaction(type, amount, isDeduction = false) {
    const user = getUserData();
    if (!user) return false;
    const finalAmount = parseFloat(amount);

    if (isDeduction && user.balance < finalAmount) {
        swal("Fondos Insuficientes", "No tienes saldo suficiente para esta transacción.", "error");
        return false;
    }

    user.balance += isDeduction ? -finalAmount : finalAmount;
    const newTransaction = {
        date: new Date().toLocaleString(), type: type,
        amount: isDeduction ? -finalAmount : finalAmount, status: 'Completado'
    };
    
    user.transactions.push(newTransaction);
    saveUserData(user); 
    updateBalanceDisplay();

    swal({
        title: "Transacción Exitosa", text: `Tu ${type.toLowerCase()} ha sido procesado.`,
        icon: "success", buttons: ["Cerrar", "Descargar PDF"],
    }).then((willDownload) => {
        if (willDownload) generatePDF(newTransaction);
    });
    return true;
}

function generateCardlessPDF(transaction, user) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.setTextColor(0, 0, 0); doc.text("La solicitud de código de retiro se realizó", 105, 20, null, null, "center");
    doc.text("exitosamente", 105, 28, null, null, "center");
    doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Nº operación ${transaction.opNumber}`, 105, 38, null, null, "center");
    doc.setFontSize(12); doc.setTextColor(50, 50, 50);
    const textLines = doc.splitTextToSize("Guarda este código para que puedas retirar el efectivo desde cualquier cajero automático o corresponsal financiero.", 150);
    doc.text(textLines, 105, 50, null, null, "center");
    doc.setFontSize(12); doc.text("Código de autorización", 105, 70, null, null, "center");
    doc.setFontSize(32); doc.setTextColor(0, 0, 0); doc.text(transaction.authCode, 105, 85, null, null, "center");
    doc.setFontSize(12); doc.setTextColor(100, 100, 100); doc.text("Válido por 1 hora", 105, 95, null, null, "center");
    doc.setDrawColor(200, 200, 200); doc.line(20, 105, 190, 105);
    doc.setFontSize(12); doc.setTextColor(0, 0, 0);
    doc.text("Monto:", 20, 120); doc.text(`$${Math.abs(transaction.amount).toFixed(2)}`, 20, 126);
    doc.text("Cuenta de débito:", 20, 140); doc.text(`${user.account}`, 20, 146);
    doc.text("Estado:", 20, 160); doc.text(`FINALIZADO`, 20, 166);
    doc.text("Fecha aplicada:", 20, 180); doc.text(`${transaction.date}`, 20, 186);
    doc.save(`Retiro_Sin_Tarjeta_${transaction.authCode}.pdf`);
}

function processCardlessWithdrawal(amount) {
    const user = getUserData();
    if (!user) return;
    const finalAmount = parseFloat(amount);

    if (user.balance < finalAmount) {
        swal("Fondos Insuficientes", "No tienes saldo suficiente para este retiro.", "error");
        return;
    }

    const authCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const opNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    user.balance -= finalAmount;
    const newTransaction = {
        date: new Date().toLocaleString(), type: 'Retiro sin tarjeta',
        amount: -finalAmount, status: 'Completado', authCode: authCode, opNumber: opNumber
    };
    
    user.transactions.push(newTransaction);
    saveUserData(user); 
    updateBalanceDisplay();

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; margin-top: 20px;">
            <p style="font-size: 13px; color: #666; margin-bottom: 15px;">Nº operación ${opNumber}</p>
            <p style="font-size: 14px; margin-bottom: 20px; line-height: 1.4;">Guarda este código para que puedas retirar el efectivo desde cualquier cajero automático o corresponsal financiero.</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 5px;">Código de autorización</p>
            <h2 style="font-weight: bold; font-size: 34px; letter-spacing: 3px; margin-bottom: 10px; color: #000;">${authCode}</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">🕒 Válido por 1 hora</p>
            <hr style="border-top: 1px solid #eee; margin: 15px 0;">
            <div style="text-align: left; font-size: 14px; line-height: 1.8;">
                <p style="margin: 0; color: #666;">Monto</p>
                <p style="margin: 0 0 10px 0; font-weight: bold;">$${finalAmount.toFixed(2)}</p>
                <p style="margin: 0; color: #666;">Cuenta de débito</p>
                <p style="margin: 0 0 10px 0; font-weight: bold;">${user.account}</p>
                <p style="margin: 0; color: #666;">Estado</p>
                <p style="margin: 0 0 10px 0; font-weight: bold;">FINALIZADO</p>
            </div>
        </div>
    `;

    swal({
        title: "La solicitud de código de retiro se realizó exitosamente", content: contentDiv,
        icon: "success", buttons: ["Cerrar", "Descargar PDF"], closeOnClickOutside: false
    }).then((willDownload) => {
        if (willDownload) generateCardlessPDF(newTransaction, user);
    });
}

function promptTransaction(type, isDeduction) {
    swal({
        title: type, text: `Ingrese el monto a depositar:`, content: "input",
        誠buttons: { cancel: "Cancelar", confirm: "Aceptar" },
    }).then(amount => {
        if (!amount || isNaN(amount) || amount <= 0) {
            if(amount) swal("Monto Inválido", "El monto debe ser un número mayor a cero", "error");
            return;
        }
        processTransaction(type, amount, isDeduction);
    });
}

function handlePayment(serviceName, amount) {
    swal({
        title: `Pago de ${serviceName}`, text: `¿Deseas pagar la factura de ${serviceName} por $${amount.toFixed(2)}?`,
        icon: "warning", buttons: ["Cancelar", "Pagar"]
    }).then((willPay) => {
        if (willPay) processTransaction(`Pago: ${serviceName}`, amount, true);
    });
}

// Inicialización controlada de la interfaz
document.addEventListener('DOMContentLoaded', function() {
    const activeUser = getUserData();
    if (activeUser) {
        const nameEl = document.getElementById('lblUserName');
        const accEl = document.getElementById('lblAccountNumber');
        if (nameEl) nameEl.textContent = activeUser.name;
        if (accEl) accEl.textContent = activeUser.account;
        updateBalanceDisplay();
    } else {
        window.location.href = 'index.html';
        return;
    }

    const btnDeposit = document.getElementById('btnDeposit');
    if (btnDeposit) btnDeposit.addEventListener('click', () => promptTransaction('Depósito', false));
    
    const btnWithdraw = document.getElementById('btnWithdraw');
    if (btnWithdraw) {
        btnWithdraw.addEventListener('click', () => {
            swal({
                title: "Retiro sin tarjeta", text: "Ingrese el monto que desea retirar:", content: "input",
                buttons: { cancel: "Cancelar", confirm: "Aceptar" },
            }).then(amount => {
                if (!amount || isNaN(amount) || amount <= 0) {
                    if(amount) swal("Monto Inválido", "El monto debe ser un número mayor a cero", "error");
                    return;
                }
                processCardlessWithdrawal(amount);
            });
        });
    }

    const btnPayEnergy = document.getElementById('btnPayEnergy');
    if (btnPayEnergy) btnPayEnergy.addEventListener('click', () => handlePayment('Energía Eléctrica', 25.50));

    const btnPayInternet = document.getElementById('btnPayInternet');
    if (btnPayInternet) btnPayInternet.addEventListener('click', () => handlePayment('Internet', 35.00));

    const btnPayWater = document.getElementById('btnPayWater');
    if (btnPayWater) btnPayWater.addEventListener('click', () => handlePayment('Telefonía y Agua', 15.75));
});