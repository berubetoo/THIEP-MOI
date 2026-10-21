# Thiệp cưới local — Nhung & Cường

Toàn bộ mã nguồn và tài nguyên của thiệp nằm trong thư mục này. Không cần DNS, hosting, SSH hoặc cài thư viện npm.

## Mở thiệp

Trên Windows, nhấp đúp **start-local.cmd**, giữ cửa sổ đó mở rồi vào **http://localhost:5500**.

Hoặc mở terminal trong thư mục này và chạy:

```powershell
npm start
```

Server chỉ lắng nghe trên máy hiện tại (`127.0.0.1`). Nhấn **Ctrl+C** trong terminal để dừng.

Nếu cổng 5500 đang được dùng:

```powershell
npm start -- --port=5501
```

Sau đó mở **http://localhost:5501**. Máy cần có Node.js 18 trở lên.

## Sửa ở đâu?

| Đường dẫn | Nội dung |
| --- | --- |
| `index.html` | Tên, ngày cưới, lời mời, địa điểm và các phần của thiệp |
| `assets/css/style.css` | Màu sắc, bố cục PC/mobile, cánh thiệp và các kiểu chuyển động |
| `assets/js/main.js` | Hiệu ứng cuộn, lịch, đếm ngược, nhạc và xử lý biểu mẫu |
| `assets/images/` | Hai cánh thiệp, hoa ren và ba dáng bóng cô dâu chú rể |
| `assets/fonts/` | Font thường, font nghiêng tiếng Việt và font thư pháp |
| `assets/audio/wedding-music.mp3` | Nhạc nền; bấm đĩa nhạc để phát/tạm dừng |
| `scripts/serve-local.mjs` | Server localhost, hỗ trợ tải ảnh/font và phát nhạc |
| `archive/` | Bản cũ, ảnh thử, ảnh chụp và các script chỉnh sửa trước đây |

Khi sửa HTML/CSS/JS, tải lại trình duyệt để xem. Giao diện, ảnh, font và nhạc không tải từ CDN. Nút chỉ đường mở Google Maps khi bấm.

Tên gia đình, một số giờ và địa điểm vẫn là thông tin mẫu. Lời chúc và xác nhận chỉ lưu trong trình duyệt đang dùng; dữ liệu từ tên miền cũ không tự chuyển sang localhost.

Các script trong `archive/development-scripts/` là lịch sử chỉnh sửa, không thuộc quy trình chạy hiện tại. Một số script chứa đường dẫn của máy cũ; không cần chạy lại chúng.
