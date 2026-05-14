// room-management.js - Quản lý phòng

let allRooms = [];
let currentRoom = null;

function loadRooms() {
    allRooms = getPhong();
    const loaiPhong = getLoaiPhong();

    // Load loại phòng vào filter
    const filterType = document.getElementById('filter-type');
    loaiPhong.forEach(lp => {
        const option = document.createElement('option');
        option.value = lp.MaLoaiPhong;
        option.textContent = lp.LoaiPhong;
        filterType.appendChild(option);
    });

    renderRooms();
    updateStats();
}

function renderRooms(filtered = allRooms) {
    const grid = document.getElementById('room-grid');
    const loaiPhong = getLoaiPhong();

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty-state">Không tìm thấy phòng nào</p>';
        return;
    }

    grid.innerHTML = filtered.map(room => {
        const loai = loaiPhong.find(lp => lp.MaLoaiPhong === room.MaLoaiPhong);
        const statusClass = room.TinhTrang === 'Trống' ? 'available' :
                           room.TinhTrang === 'Đang thuê' ? 'occupied' : 'maintenance';

        return `
            <div class="room-card ${statusClass}" onclick="openRoomModal(${room.SoPhong})">
                <div class="room-number">${room.SoPhong}</div>
                <div class="room-type">${loai ? loai.LoaiPhong : 'N/A'}</div>
                <div class="room-price">${loai ? loai.DonGia.toLocaleString('vi-VN') : '0'} VNĐ</div>
                <span class="room-status ${statusClass}">${room.TinhTrang}</span>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const total = allRooms.length;
    const available = allRooms.filter(r => r.TinhTrang === 'Trống').length;
    const occupied = allRooms.filter(r => r.TinhTrang === 'Đang thuê').length;

    document.getElementById('total-rooms').textContent = total;
    document.getElementById('available-rooms').textContent = available;
    document.getElementById('occupied-rooms').textContent = occupied;
}

function setupFilters() {
    const filterType = document.getElementById('filter-type');
    const filterStatus = document.getElementById('filter-status');
    const searchRoom = document.getElementById('search-room');

    const applyFilters = () => {
        let filtered = allRooms;

        // Filter by type
        if (filterType.value) {
            filtered = filtered.filter(r => r.MaLoaiPhong === parseInt(filterType.value));
        }

        // Filter by status
        if (filterStatus.value) {
            filtered = filtered.filter(r => r.TinhTrang === filterStatus.value);
        }

        // Search by room number
        if (searchRoom.value) {
            const search = searchRoom.value.toLowerCase();
            filtered = filtered.filter(r => r.SoPhong.toString().includes(search));
        }

        renderRooms(filtered);
    };

    filterType.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    searchRoom.addEventListener('input', applyFilters);
}

function openRoomModal(soPhong) {
    currentRoom = allRooms.find(r => r.SoPhong === soPhong);
    if (!currentRoom) return;

    const loaiPhong = getLoaiPhong();
    const loai = loaiPhong.find(lp => lp.MaLoaiPhong === currentRoom.MaLoaiPhong);

    document.getElementById('modal-room-number').textContent = currentRoom.SoPhong;
    document.getElementById('modal-room-type').textContent = loai ? loai.LoaiPhong : 'N/A';
    document.getElementById('modal-room-price').textContent =
        (loai ? loai.DonGia.toLocaleString('vi-VN') : '0') + ' VNĐ/ngày';
    document.getElementById('modal-room-status').value = currentRoom.TinhTrang;
    document.getElementById('modal-room-note').value = currentRoom.GhiChu || '';

    document.getElementById('room-modal').classList.add('show');
}

function closeRoomModal() {
    document.getElementById('room-modal').classList.remove('show');
    currentRoom = null;
}

function saveRoomChanges() {
    if (!currentRoom) return;

    const newStatus = document.getElementById('modal-room-status').value;
    const newNote = document.getElementById('modal-room-note').value;

    // Update room
    const rooms = getPhong();
    const index = rooms.findIndex(r => r.SoPhong === currentRoom.SoPhong);
    if (index !== -1) {
        rooms[index].TinhTrang = newStatus;
        rooms[index].GhiChu = newNote;
        savePhong(rooms);

        alert('Cập nhật phòng thành công!');
        closeRoomModal();
        loadRooms();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('room-modal');
    if (event.target === modal) {
        closeRoomModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
    setupFilters();
});
