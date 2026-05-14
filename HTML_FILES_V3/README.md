# 🏨 HỆ THỐNG QUẢN LÝ KHÁCH SẠN - VERSION 3

## ✨ CẢI TIẾN MỚI TRONG V3

### 1. **Date Input với Auto-Format dd/mm/yyyy**
- Nhập ngày tự động thêm dấu `/`
- Validate ngày tháng năm hợp lệ
- Không cần chọn từ calendar picker

**Cách sử dụng:**
```
Nhập: 1 → 10 → 2 → 02 → 0 → 2 → 5 → tự động thành: 10/02/2025
```

### 2. **Chức năng View/Edit cho Phiếu Thuê**
- **Xem chi tiết**: Click icon mắt → Xem thông tin read-only
- **Chỉnh sửa**: Click icon bút → Cập nhật thông tin phiếu
- **Xóa**: Click icon thùng rác → Xóa phiếu (cập nhật phòng về Trống)

### 3. **Hiển thị ngày theo định dạng Việt Nam**
- Tất cả ngày hiển thị: dd/mm/yyyy
- Lưu vào database: yyyy-mm-dd (ISO format)

## 📁 CẤU TRÚC FILE

```
HTML_FILES_V3_TXT/
├── css/
│   ├── common.css.txt
│   ├── booking-list.css.txt
│   ├── booking-form-v3.css.txt     ✨ MỚI
│   ├── checkout-list.css.txt
│   └── room-management.css.txt
│
├── js/
│   ├── data-structure.js.txt
│   ├── common-v3.js.txt            ✨ MỚI
│   ├── date-input.js.txt           ✨ MỚI - Component nhập ngày
│   ├── booking-list-v3.js.txt      ✨ MỚI - Có view/edit
│   ├── booking-form-v3.js.txt      ✨ MỚI - Hỗ trợ create/view/edit
│   ├── checkout-list-v3.js.txt     ✨ MỚI - Date input dd/mm/yyyy
│   └── room-management.js.txt
│
├── booking-list-v3.html.txt        ✨ MỚI
├── booking-form-v3.html.txt        ✨ MỚI
├── checkout-list-v3.html.txt       ✨ MỚI
├── room-management.html.txt
└── README.md                       📖 File này
```

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Copy files và đổi tên
```bash
# Bỏ đuôi .txt khỏi tất cả file
cd HTML_FILES_V3_TXT
for f in **/*.txt; do mv "$f" "${f%.txt}"; done
```

### Bước 2: Mở trình duyệt
```
Mở file: booking-list-v3.html
```

### Bước 3: Test các tính năng mới

#### A. Nhập ngày tự động format
1. Vào "Tạo phiếu thuê phòng"
2. Click vào ô "Ngày lập"
3. Nhập: `10022025` → Tự động thành `10/02/2025`
4. Nếu sai (ví dụ `32/01/2025`) → Hiện cảnh báo

#### B. Xem chi tiết phiếu
1. Vào "Thuê phòng"
2. Click icon mắt (👁️) ở cột "Thao tác"
3. Xem thông tin read-only
4. Tất cả input bị disable

#### C. Chỉnh sửa phiếu
1. Vào "Thuê phòng"
2. Click icon bút (✏️)
3. Sửa thông tin (ngày, khách, phòng)
4. Click "Cập nhật phiếu"

#### D. Trả phòng với date input mới
1. Vào "Trả phòng"
2. Click icon ✓
3. Nhập ngày trả theo format: `15/05/2026`
4. Tự động tính tiền

## 🎯 CÁC TÍNH NĂNG CHÍNH

### 1. Thuê phòng (booking-list-v3.html + booking-form-v3.html)
✅ Tạo phiếu thuê mới
✅ Xem chi tiết phiếu (read-only)
✅ Chỉnh sửa phiếu
✅ Xóa phiếu (cập nhật phòng về Trống)
✅ Tìm kiếm theo số phòng hoặc tên khách
✅ Nhập ngày dd/mm/yyyy tự động

### 2. Trả phòng (checkout-list-v3.html)
✅ Danh sách phòng đang thuê
✅ Nhập ngày trả dd/mm/yyyy
✅ Tính tiền tự động theo công thức phức tạp
✅ Tạo hóa đơn (HOADON + CTHOADON)
✅ Cập nhật phòng về Trống

### 3. Quản lý phòng (room-management.html)
✅ 28 phòng (4 loại)
✅ Lọc theo loại/tình trạng
✅ Cập nhật tình trạng phòng

## 💡 SO SÁNH V2 vs V3

| Tính năng | V2 | V3 |
|-----------|----|----|
| Date format | yyyy-mm-dd | dd/mm/yyyy ✨ |
| Auto format | ❌ | ✅ Tự động thêm / |
| View phiếu | ❌ | ✅ Read-only mode |
| Edit phiếu | ❌ | ✅ Update mode |
| Validate ngày | Cơ bản | ✅ Đầy đủ (ngày/tháng hợp lệ) |

## 📊 CÔNG THỨC TÍNH TIỀN (KHÔNG ĐỔI)

```javascript
TienKhach = DonGiaPhong × HeSoKhach × HeSoLoaiKhach
TongMotNgay = Σ(TienKhach)
ThanhTien = TongMotNgay × SoNgay
```

**Ví dụ:**
- Phòng Deluxe (800k), 3 khách, 3 ngày
- Khách 1 (Nội địa): 800k × 1.0 × 1.0 = 800k
- Khách 2 (Nội địa): 800k × 1.0 × 1.0 = 800k
- Khách 3 (Nước ngoài): 800k × 1.25 × 1.5 = 1,500k
- **Tổng/ngày: 3,100k**
- **Tổng 3 ngày: 9,300k VNĐ**

## 🐛 DEBUG

```javascript
// Console (F12)
console.log('PHONG:', getPhong());
console.log('THUEPHONG:', getThuePhong());

// Reset database
localStorage.clear();
location.reload();
```

## ⚡ CHANGELOG

### Version 3.0
- ✨ Thêm date input auto-format dd/mm/yyyy
- ✨ Thêm chức năng View/Edit phiếu thuê
- ✨ Hiển thị ngày theo định dạng Việt Nam
- ✨ Validate ngày tháng đầy đủ
- 🐛 Fix: Encoding issues với tiếng Việt
- 📝 Cải thiện UX cho nhập ngày

### Version 2.0
- Theo database schema đầy đủ
- Tính tiền phức tạp (TILEPHUTHU + LOAIKHACH)
- Tạo hóa đơn tự động
- Quản lý 28 phòng

---

**Lưu ý:** Tất cả file đều ở dạng `.txt` để tránh đè lên bản cũ.
Khi sử dụng, bỏ đuôi `.txt` đi!
