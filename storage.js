const USERS_DB_KEY = 'pokemonBankUsersList'; 
const CURRENT_USER_KEY = 'pokemonBankData';  
const ACCOUNT_COUNTER_KEY = 'nextAccountNumber'; 

function initApp() {
    if (!localStorage.getItem(USERS_DB_KEY)) {
        const initialUsers = [{ 
            name: 'Ash Ketchum', pin: '1234', account: '0987654321', balance: 500.00, 
            transactions: [{ date: new Date().toLocaleString(), type: 'Depósito inicial', amount: 500.00, status: 'Completado' }] 
        }];
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(ACCOUNT_COUNTER_KEY)) {
        localStorage.setItem(ACCOUNT_COUNTER_KEY, '100000');
    }
}
initApp(); 

function getUserData() { 
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)); 
}

function saveUserData(data) { 
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data)); 
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY));
    const userIndex = users.findIndex(u => u.pin === data.pin);
    if (userIndex !== -1) {
        users[userIndex] = data;
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
}