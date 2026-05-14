// checkout-list.js - Logic cho trang trả phòng

let activeBookings = [];
let currentCheckoutBooking = null;

function initializeData() {
    // Lấy tất cả booking từ localStorage
    const allBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');

    // Lọc các phòng đang được thuê (chưa trả)
    const checkedOutIds = JSON.parse(localStorage.getItem('checkedOutBookings') || '[]');
    activeBookings = allBookings.filter(b => !checkedOutIds.includes(b.id));
}

function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate || new Date());
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Tối thiểu 1 ngày
}

function renderActiveBookings(data = activeBookings) {
    const tbody = document.getElementById('active-bookings-table');

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Không có phòng nào đang được thuê</td></tr>';
        document.getElementById('showing-count').textContent = '0';
        return;
    }

    tbody.innerHTML = data.map((booking, index) => {
        const days = calculateDays(booking.startDate);
        return `
        <tr>
            <td>${index + 1}</td>
            <td><span class="badge badge-room">${booking.roomNumber}</span></td>
            <td>${formatDate(booking.startDate)}</td>
            <td><span class="badge badge-days">${days} ngày</span></td>
            <td>${booking.guests.map(g => g.name).join(', ')}</td>
            <td><span class="badge badge-guests">${booking.guests.length} khách</span></td>
            <td>
                <div class="guest-types">
                    ${booking.guests.map(g => `
                        <span class="badge-type ${g.type === 'nội địa' ? 'badge-local' : 'badge-foreign'}">
                            ${g.type}
                        </span>
                    `).join('')}
                </div>
            </td>
            <td>
                <div class="actions">
                    <button class="btn-checkout" onclick="openCheckoutModal(${booking.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Trả phòng
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');

    document.getElementById('showing-count').textContent = data.length;
}

function openCheckoutModal(bookingId) {
    currentCheckoutBooking = activeBookings.find(b => b.id === bookingId);
    if (!currentCheckoutBooking) return;

    // Fill modal data
    document.getElementById('modal-room').textContent = currentCheckoutBooking.roomNumber;
    document.getElementById('modal-guest').textContent = currentCheckoutBooking.guests.map(g => g.name).join(', ');
    document.getElementById('modal-start-date').textContent = formatDate(currentCheckoutBooking.startDate);

    // Set checkout date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkout-date').value = today;

    // Calculate and display
    updateCheckoutCalculation();

    // Show modal
    document.getElementById('checkout-modal').classList.add('show');

    // Add event listeners
    document.getElementById('checkout-date').addEventListener('change', updateCheckoutCalculation);
    document.getElementById('room-price').addEventListener('input', updateCheckoutCalculation);
}

function updateCheckoutCalculation() {
    if (!currentCheckoutBooking) return;

    const startDate = currentCheckoutBooking.startDate;
    const endDate = document.getElementById('checkout-date').value;
    const price = parseFloat(document.getElementById('room-price').value) || 500000;

    const days = calculateDays(startDate, endDate);
    const total = days * price;

    document.getElementById('modal-days').textContent = days;
    document.getElementById('modal-total').textContent = total.toLocaleString('vi-VN') + ' VNĐ';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
    currentCheckoutBooking = null;
}

function confirmCheckout() {
    if (!currentCheckoutBooking) return;

    const checkoutDate = document.getElementById('checkout-date').value;
    const price = parseFloat(document.getElementById('room-price').value) || 500000;
    const days = calculateDays(currentCheckoutBooking.startDate, checkoutDate);
    const total = days * price;

    if (!checkoutDate) {
        alert('Vui lòng chọn ngày trả phòng!');
        return;
    }

    if (confirm(`Xác nhận trả phòng ${currentCheckoutBooking.roomNumber}?\n\nSố ngày: ${days}\nTổng tiền: ${total.toLocaleString('vi-VN')} VNĐ`)) {
        // Lưu thông tin checkout
        const checkoutInfo = {
            bookingId: currentCheckoutBooking.id,
            roomNumber: currentCheckoutBooking.roomNumber,
            guests: currentCheckoutBooking.guests,
            startDate: currentCheckoutBooking.startDate,
            checkoutDate: checkoutDate,
            days: days,
            pricePerDay: price,
            total: total,
            checkoutTime: new Date().toISOString()
        };

        // Lưu vào danh sách đã trả phòng
        const checkedOutIds = JSON.parse(localStorage.getItem('checkedOutBookings') || '[]');
        checkedOutIds.push(currentCheckoutBooking.id);
        localStorage.setItem('checkedOutBookings', JSON.stringify(checkedOutIds));

        // Lưu hóa đơn
        const invoices = JSON.parse(localStorage.getItem('hotelInvoices') || '[]');
        invoices.push(checkoutInfo);
        localStorage.setItem('hotelInvoices', JSON.stringify(invoices));

        alert('Trả phòng thành công!');

        closeCheckoutModal();
        initializeData();
        renderActiveBookings();
        updateTotalCount();
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = activeBookings.filter(booking =>
            booking.roomNumber.toLowerCase().includes(searchTerm) ||
            booking.guests.some(g => g.name.toLowerCase().includes(searchTerm))
        );
        renderActiveBookings(filtered);
    });
}

function updateTotalCount() {
    document.getElementById('total-active').textContent = activeBookings.length;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkout-modal');
    if (event.target === modal) {
        closeCheckoutModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    renderActiveBookings();
    setupSearch();
    updateTotalCount();
});
