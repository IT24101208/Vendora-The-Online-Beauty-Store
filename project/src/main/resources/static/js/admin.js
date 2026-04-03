document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadPayments();
    updateDashboardStats();
});

// --- 1. Dashboard Stats Update
async function updateDashboardStats() {
    try {
        const response = await fetch('http://localhost:8080/api/orders/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();

        const revenueEl = document.getElementById('total-revenue');
        const ordersEl = document.getElementById('total-orders');
        const pendingEl = document.getElementById('pending-orders');
        const avgEl = document.getElementById('avg-value');

        if(revenueEl) revenueEl.innerText = `Rs. ${data.totalRevenue}`;
        if(ordersEl) ordersEl.innerText = data.totalOrders;
        if(pendingEl) pendingEl.innerText = data.pendingOrders;
        if(avgEl) avgEl.innerText = `Rs. ${data.avgOrderValue}`;

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
    }
}

// --- 2. Load Orders (US_4.3) ---
async function loadOrders() {
    try {
        const response = await fetch('http://localhost:8080/api/orders');
        if (!response.ok) throw new Error("Orders fetch failed");

        const orders = await response.json();
        const tableBody = document.getElementById('orderTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = "";

        orders.forEach(order => {
            const status = order.status || 'Pending';
            const name = `${order.firstName || ''} ${order.lastName || ''}`;

            tableBody.innerHTML += `
                <tr>
                    <td>#${order.id}</td>
                    <td>${name}</td>
                    <td>${order.product}</td>
                    <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
                    <td>
                        <button class="btn-status" style="background:#be185d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="updateStatus(${order.id})">Update Status</button>
                        <button class="btn-del" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="deleteOrder(${order.id})">Delete Order</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error("Error loading orders:", error); }
}

// --- 3. Load Payments (US_4.7) ---
async function loadPayments() {
    try {
        const response = await fetch('http://localhost:8080/api/orders');
        const orders = await response.json();
        const payBody = document.getElementById('paymentTableBody');

        if (!payBody) return;
        payBody.innerHTML = "";

        orders.forEach(order => {
            const pStatus = order.paymentStatus || 'PENDING';

            payBody.innerHTML += `
                <tr>
                    <td>#${order.id}</td> 
                    <td>Rs. ${order.amount ? order.amount.toFixed(2) : '0.00'}</td>
                    <td><strong>${order.paymentMethod || 'N/A'}</strong></td>
                    <td><span class="status-badge ${pStatus.toLowerCase()}">${pStatus}</span></td>
                    <td>
                        ${pStatus === 'PENDING' ?
                `<button class="btn-pay" style="background:#059669; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="confirmPayment(${order.id})">Confirm Receipt</button>` :
                '<span style="color: #059669; font-weight: bold;">✅ Verified</span>'}
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error("Error loading payments:", error); }
}

// --- 4. Status Update (US_4.4) ---
async function updateStatus(id) {
    const s = prompt("New Status (Shipped / Delivered / Pending):");
    if(s) {
        const res = await fetch(`http://localhost:8080/api/orders/${id}/status`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(s)
        });
        if (res.ok) {
            alert("Status Updated!");
            loadOrders();
            updateDashboardStats();
        }
    }
}

// --- 5. Payment Confirm (US_4.7) ---
async function confirmPayment(id) {
    if(confirm("Confirm receipt of payment for Order #" + id + "?")) {
        const res = await fetch(`http://localhost:8080/api/orders/${id}/pay-confirm`, { method: 'PUT' });
        if (res.ok) {
            alert("Payment Verified!");
            loadOrders();
            loadPayments();
            updateDashboardStats();
        }
    }
}

// --- 6. Delete Order ---
async function deleteOrder(id) {
    if(confirm("Delete this order?")) {
        const res = await fetch(`http://localhost:8080/api/orders/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadOrders();
            loadPayments();
            updateDashboardStats();
        }
    }
}