// Sample data for September, October, and November
let transactions = [
    // September
    {
        id: 1,
        date: '2024-09-15',
        description: 'Freelance Project',
        category: 'Web Development',
        paymentMethod: 'PayPal',
        amount: 2500,
        type: 'income'
    },
    {
        id: 2,
        date: '2024-09-20',
        description: 'Grocery Shopping',
        category: 'Food',
        paymentMethod: 'Credit Card',
        amount: 150,
        type: 'expense'
    },
    // October
    {
        id: 3,
        date: '2024-10-05',
        description: 'Monthly Salary',
        category: 'Salary',
        paymentMethod: 'Direct Deposit',
        amount: 4000,
        type: 'income'
    },
    {
        id: 4,
        date: '2024-10-10',
        description: 'Rent Payment',
        category: 'Housing',
        paymentMethod: 'Bank Transfer',
        amount: 1200,
        type: 'expense'
    },
    // November
    {
        id: 5,
        date: '2024-11-03',
        description: 'Wisconsin Junk Cars',
        category: 'Investments',
        paymentMethod: 'Metrobank',
        amount: 10000,
        type: 'expense'
    },
    {
        id: 6,
        date: '2024-11-03',
        description: 'ChatGPT',
        category: 'Self-development',
        paymentMethod: 'Cash',
        amount: 1000,
        type: 'expense'
    },
    {
        id: 7,
        date: '2024-11-03',
        description: 'Web Development/JimTech Solutions',
        category: 'Web Development',
        paymentMethod: 'Metrobank',
        amount: 50000,
        type: 'income'
    }
];

let currentMonth = new Date();
let currentFilter = 'all';
let currentSearch = '';

const categoryOptions = {
    income: ['Salary', 'Freelance', 'Investments', 'Web Development', 'Other'],
    expense: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Self-development', 'Investments', 'Other']
};

// Helper Functions

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount).replace('$', '$ ');
};

/**
 * Formats a date string into a human-readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }).format(date);
};

/**
 * Updates the total income, expenses, and balance display
 * @param {Array} filteredTransactions - The filtered transactions to calculate totals from
 */
const updateTotals = (filteredTransactions) => {
    const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const total = income - expenses;

    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expenses').textContent = formatCurrency(expenses);
    document.getElementById('total-balance').textContent = formatCurrency(total);
};

/**
 * Groups transactions by date
 * @param {Array} filteredTransactions - The filtered transactions to group
 * @returns {Object} An object with dates as keys and arrays of transactions as values
 */
const groupTransactionsByDate = (filteredTransactions) => {
    return filteredTransactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});
};

/**
 * Filters transactions based on current month, filter, and search term
 * @returns {Array} Filtered transactions
 */
const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const matchesMonth = transactionDate.getMonth() === currentMonth.getMonth() &&
                             transactionDate.getFullYear() === currentMonth.getFullYear();
        const matchesFilter = currentFilter === 'all' || transaction.type === currentFilter;
        const matchesSearch = currentSearch === '' ||
                              transaction.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              transaction.category.toLowerCase().includes(currentSearch.toLowerCase()) ||
                              transaction.paymentMethod.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesMonth && matchesFilter && matchesSearch;
    });
};

/**
 * Renders the transactions list in the UI
 */
const renderTransactions = () => {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';

    const filteredTransactions = getFilteredTransactions();

    // Sort transactions by date in descending order
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    updateTotals(filteredTransactions);

    const groupedTransactions = groupTransactionsByDate(filteredTransactions);

    Object.entries(groupedTransactions).forEach(([date, dayTransactions]) => {
        const dateIncome = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const dateExpenses = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.innerHTML = `
            <div class="date-info">
                <span class="date-number">${new Date(date).getDate()}</span>
                <div class="date-details">
                    <span class="day">${formatDate(date)}</span>
                </div>
            </div>
            <div class="date-totals">
                <span class="income">${formatCurrency(dateIncome)}</span>
                <span class="expense">${formatCurrency(dateExpenses)}</span>
            </div>
        `;
        transactionsList.appendChild(dateHeader);

        dayTransactions.forEach(transaction => {
            const element = document.createElement('div');
            element.className = 'transaction';
            element.innerHTML = `
                <div class="transaction-header">
                    <span class="transaction-title">${transaction.description}</span>
                    <span class="transaction-amount ${transaction.type}">${formatCurrency(transaction.amount)}</span>
                </div>
                <div class="transaction-details">
                    ${transaction.category} • ${transaction.paymentMethod}
                </div>
            `;
            transactionsList.appendChild(element);
            
            // Trigger reflow to enable transition
            void element.offsetWidth;
            element.classList.add('show');
        });
    });
};

/**
 * Updates the month display in the header
 */
const updateMonthDisplay = () => {
    const monthYearString = new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        year: 'numeric' 
    }).format(currentMonth);
    document.getElementById('current-month').textContent = monthYearString;
};

/**
 * Populates the category dropdown based on the selected transaction type
 */
const populateCategoryDropdown = () => {
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const selectedType = typeSelect.value;

    categorySelect.innerHTML = '';
    categoryOptions[selectedType].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
};

/**
 * Shows the modal
 */
const showModal = () => {
    const modal = document.getElementById('transaction-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
};

/**
 * Hides the modal
 */
const hideModal = () => {
    const modal = document.getElementById('transaction-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('transaction-form').reset();
    }, 200);
};

// Event Listeners
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    updateMonthDisplay();
    renderTransactions();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    updateMonthDisplay();
    renderTransactions();
});

document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.tabs button.active').classList.remove('active');
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTransactions();
    });
});

document.getElementById('add-transaction').addEventListener('click', showModal);

document.getElementById('close-modal').addEventListener('click', hideModal);

document.getElementById('cancel-transaction').addEventListener('click', hideModal);

document.getElementById('type').addEventListener('change', populateCategoryDropdown);

document.getElementById('transaction-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTransaction = {
        id: Date.now(),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        paymentMethod: document.getElementById('payment-method').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value
    };

    transactions.push(newTransaction);
    renderTransactions();
    hideModal();
});

// Close modal when clicking outside
document.getElementById('transaction-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('transaction-modal')) {
        hideModal();
    }
});

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTransactions();
});

// Set default date to today
document.getElementById('date').valueAsDate = new Date();

// Initialize
updateMonthDisplay();
populateCategoryDropdown();
renderTransactions();