1 # HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH HỆ THỐNG (Dành cho người mới)
2
3 Chào mừng bạn đã sở hữu bộ mã nguồn. Tài liệu này giúp bạn tự cài đặt hệ thống từ đầu trên máy tính Windows.
4
5 ## 📌 Các bước chuẩn bị (Cần cài đặt trước)
6
7 Bạn cần tải và cài đặt 3 phần mềm sau theo thứ tự:
8
9 1.  **XAMPP (Để chạy Cơ sở dữ liệu MySQL):** [Tải tại đây](https://www.apachefriends.org/download.html) (Chọn bản
  cho Windows).
10 2.  **Java JDK 17:** [Tải tại đây](https://www.oracle.com/java/technologies/downloads/#java17) (Chọn x64
  Installer).
11 3.  **Node.js:** [Tải tại đây](https://nodejs.org/en/download/) (Chọn bản LTS - Khuyên dùng).
12
13 ---
14
15 ## 🚀 Hướng dẫn chi tiết từng bước
16
17 ### Bước 1: Thiết lập Cơ sở dữ liệu (Database)
18 1. Mở phần mềm **XAMPP Control Panel**.
19 2. Nhấn nút **Start** ở dòng **Apache** và **MySQL** (Khi hiện màu xanh là thành công).
20 3. Truy cập đường dẫn: http://localhost/phpmyadmin/
21 4. Nhấn vào mục **Mới (New)** ở cột bên trái -> Đặt tên cơ sở dữ liệu là: `btl_cnpm` (Hoặc tên khớp với cấu hình
  trong code).
22 5. Nhấn **Nhập (Import)** -> Chọn tệp tin `.sql` (nếu có trong thư mục dự án) -> Nhấn **Thực hiện (Go)**.
23
24 ### Bước 2: Chạy Backend (Máy chủ Java Spring Boot)
25 1. Truy cập vào thư mục: `java-web/`
26 2. Nhấp chuột phải vào vùng trống, chọn "Open in Terminal" (hoặc PowerShell).
27 3. Gõ lệnh sau để khởi động:
  ./mvnw spring-boot:run

1 4. Khi thấy dòng chữ `Started JavaWebApplication in ... seconds` là thành công.
2
3 ### Bước 3: Chạy Frontend (Giao diện người dùng)
4 1. Quay lại thư mục gốc của dự án.
5 2. Mở Terminal (PowerShell) tại thư mục này.
6 3. Gõ lệnh cài đặt thư viện (Chỉ cần làm lần đầu):
  npm install

1 4. Gõ lệnh khởi chạy giao diện:
  npm run dev

1 5. Màn hình sẽ hiện một đường dẫn (thường là http://localhost:5173). Hãy copy và dán vào trình duyệt Web.
2
3 ---
4
5 ## 🛠 Một số lưu ý khi sử dụng
6 *   Luôn mở XAMPP trước khi chạy code.
7 *   Nếu gặp lỗi cổng (Port), hãy đảm bảo không có phần mềm nào khác đang chiếm cổng 8080 (của Java) và 5173 (của
  React).
8 *   Mọi thông tin đăng nhập mặc định (nếu có) thường là: `admin` / `admin123`.