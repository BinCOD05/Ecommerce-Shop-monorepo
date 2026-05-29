# Backend API Reference — Ecommerce Java Spring Boot

> Dùng file này khi xây dựng hoặc chỉnh sửa Frontend để đảm bảo khớp với API.

---

## 1. Thông tin kết nối

| | |
|---|---|
| **Base URL (dev)** | `http://localhost:8081` |
| **Auth scheme** | Bearer JWT — gắn vào header: `Authorization: Bearer <accessToken>` |
| **Content-Type mặc định** | `application/json` |
| **Swagger UI (dev)** | `http://localhost:8081/swagger-ui/index.html` |

---

## 2. Cấu trúc Response chuẩn

Hầu hết API trả về wrapper `ApiResponse<T>`:

```json
{
  "status": 200,
  "message": "success message",
  "result": { ... }
}
```

> **Lưu ý:** Dữ liệu thực sự nằm trong `result`. Interceptor nên unwrap về `result` để dùng.

### Phân trang — `PageResponse<T>`

```json
{
  "status": 200,
  "result": {
    "page": 0,
    "size": 30,
    "totalPage": 5,
    "totalElement": 150,
    "content": [ ... ]
  }
}
```

> Page bắt đầu từ **0** (Spring Pageable convention).

---

## 3. Endpoint công khai (không cần token)

```
/auth/**
/api/products/**
/api/categories
/api/brands
```

Mọi endpoint còn lại **đều cần** header `Authorization: Bearer <token>`.

---

## 4. Enums

```ts
type RoleType    = 'OWNER' | 'ADMIN' | 'USER'
type Gender      = 'MALE' | 'FEMALE' | 'OTHER'
type AddressType = 'HOME' | 'WORK'
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
```

---

## 5. Authentication

### 5.1 Login

```
POST /auth/access-token
Content-Type: application/json
```

**Request body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (KHÔNG bọc ApiResponse — trả thẳng):
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

> Sau khi nhận token, gọi `GET /api/users/me` để lấy thông tin user.

### 5.2 Register

```
POST /auth/register
Content-Type: application/json
```

**Request body:**
```json
{
  "username": "string",
  "fullName": "string",
  "password": "string",
  "phone": "string",
  "email": "string"
}
```

**Response:** `ApiResponse<UserResponse>`

---

## 6. User

### TypeScript types

```ts
interface UserResponse {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  gender: Gender | null
  roleTypes: RoleType[]
  createdAt: string  // ISO datetime
}
```

### Endpoints

#### Lấy thông tin bản thân
```
GET /api/users/me
Authorization: Bearer <token>
```
→ `ApiResponse<UserResponse>`

#### Cập nhật thông tin
```
PUT /api/users/upd
Authorization: Bearer <token>
```
```json
{
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "gender": "MALE | FEMALE | OTHER"
}
```
→ `ApiResponse<UserResponse>`

#### Đổi mật khẩu
```
PATCH /api/users/change-pwd
Authorization: Bearer <token>
```
```json
{
  "password": "mật khẩu hiện tại",
  "newPassword": "mật khẩu mới",
  "confirmPassword": "xác nhận mật khẩu mới"
}
```
→ `ApiResponse<null>`

#### Tìm kiếm / Danh sách user (Admin)
```
POST /api/users/search?page=0&size=10&sort=createdAt&direction=ASC
Authorization: Bearer <token>
```
```json
{
  "keyword": "string (optional)"
}
```
→ `ApiResponse<PageResponse<UserResponse>>`

#### Xem user theo ID (Admin)
```
GET /api/users/{id}
Authorization: Bearer <token>  (ADMIN)
```
→ `ApiResponse<UserResponse>`

#### Đổi role user (Admin/Owner)
```
PUT /api/users/{id}
Authorization: Bearer <token>  (ADMIN)
```
```json
{
  "roleType": "ADMIN | USER | OWNER"
}
```

#### Xóa user (Admin)
```
DELETE /api/users/{id}
Authorization: Bearer <token>
```

---

## 7. Product

### TypeScript types

```ts
interface ProductSummaryResponse {
  id: number
  name: string
  price: number        // BigDecimal từ BE → parse về number
  brandName: string
  brandId: number
  categoryName: string
  categoryId: number
  color: string
  thumbnailUrl: string
  stock: number
}

interface ProductDetailResponse {
  id: number
  name: string
  description: string
  color: string
  storage: string
  price: number
  stock: number
  category: { id: number; name: string }
  brand: { id: number; name: string }
  images: Array<{
    id: number
    imageUrl: string
    primary: boolean
    sortOrder: number
  }>
  specs: Array<{
    id: number
    name: string
    value: string
  }>
}
```

### Endpoints

#### Danh sách sản phẩm (public, có filter + phân trang)
```
GET /api/products?keyword=&brandId=&categoryId=&minPrice=&maxPrice=&page=0&size=30
```
→ `ApiResponse<PageResponse<ProductSummaryResponse>>`

**Query params filter:**
| Param | Type | Mô tả |
|---|---|---|
| keyword | string | Tìm theo tên |
| brandId | number | Lọc theo thương hiệu |
| categoryId | number | Lọc theo danh mục |
| minPrice | number | Giá tối thiểu |
| maxPrice | number | Giá tối đa |
| page | number | Bắt đầu từ 0 |
| size | number | Default 30 |

#### Chi tiết sản phẩm (public)
```
GET /api/products/{id}
```
→ `ApiResponse<ProductDetailResponse>`

#### Tạo sản phẩm (Admin) — multipart/form-data
```
POST /api/products
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

> Đây là form-data, **không phải JSON**. Gửi 2 phần:
> - `product` (JSON blob): thông tin sản phẩm
> - `files` (array file): danh sách ảnh upload

**Phần `product` (JSON stringify):**
```json
{
  "name": "string",
  "color": "string",
  "storage": "string",
  "price": 10000000,
  "description": "string",
  "isActive": true,
  "brandId": 1,
  "categoryId": 1,
  "stock": 100,
  "specs": [
    { "name": "RAM", "value": "8GB" }
  ],
  "images": [
    { "primary": true, "sortOrder": 0 },
    { "primary": false, "sortOrder": 1 }
  ]
}
```

> **Quan trọng:** `images.length` phải bằng `files.length`. Thứ tự tương ứng nhau.

**Cách gửi bằng FormData:**
```js
const formData = new FormData();
formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
files.forEach(file => formData.append('files', file));
```

#### Cập nhật sản phẩm (Admin)
```
PUT /api/products/{id}
Authorization: Bearer <token>
```
```json
{
  "name": "string",
  "price": 10000000,
  "color": "string",
  "storage": "string",
  "description": "string",
  "stock": 50,
  "isActive": true
}
```

#### Xóa sản phẩm (Admin)
```
DELETE /api/products/{id}
Authorization: Bearer <token>
```

---

## 8. Category & Brand (public)

```
GET /api/categories   → ApiResponse<Category[]>
GET /api/brands       → ApiResponse<Brand[]>
```

```ts
interface Category { id: number; name: string }
interface Brand    { id: number; name: string }
```

---

## 9. Cart (cần token)

### TypeScript types

```ts
interface CartItemResponse {
  id: number
  productId: number
  productName: string
  productImage: string
  color: string
  price: number
  quantity: number
  selected: boolean
  maxStock: number   // dùng để validate UI không cho vượt quá tồn kho
}

interface CartResponse {
  id: number
  totalItems: number
  totalPrice: number
  cartItemResponses: CartItemResponse[]
}
```

### Endpoints

#### Xem giỏ hàng
```
GET /api/cart
Authorization: Bearer <token>
```
→ `ApiResponse<CartResponse>`

#### Thêm vào giỏ
```
POST /api/cart
Authorization: Bearer <token>
```
```json
{
  "productId": 1,
  "quantity": 2
}
```
→ trả `null` (chỉ cần check status 200)

#### Cập nhật số lượng
```
PUT /api/cart/items/{itemId}
Authorization: Bearer <token>
```
```json
{
  "quantity": 3
}
```
→ `ApiResponse<CartResponse>`

#### Chọn / bỏ chọn item (để đặt hàng)
```
PATCH /api/cart/items/{itemId}/select
Authorization: Bearer <token>
```
```json
{
  "selected": true
}
```
→ `ApiResponse<CartResponse>`

#### Xóa item khỏi giỏ
```
DELETE /api/cart/items/{itemId}
Authorization: Bearer <token>
```
→ `ApiResponse<CartResponse>`

> **Note UI:** Chỉ những item có `selected: true` mới được tính vào `totalPrice`. Khi tạo order, truyền đúng `cartItemIds` của các item đã `selected`.

---

## 10. Order (cần token)

### TypeScript types

```ts
interface OrderItemResponse {
  id: number
  productName: string
  quantity: number
  price: number
  imei: string | null
}

interface OrderResponse {
  id: number
  code: string
  status: OrderStatus
  orderDate: string      // ISO datetime
  totalPrice: number
  name: string           // tên người nhận
  phoneNumber: string
  address: string        // địa chỉ dạng string đã format
  orderItems: OrderItemResponse[]
}
```

### Endpoints

#### Tạo đơn hàng
```
POST /api/orders
Authorization: Bearer <token>
```
```json
{
  "addressId": 1,
  "note": "giao giờ hành chính",
  "cartItemIds": [3, 7, 12],
  "voucherCode": "SALE10"
}
```
→ `OrderResponse` (trả thẳng qua `ResponseEntity`)

> `cartItemIds` là ID của các `CartItem` đã `selected: true` trong giỏ.

#### Xem đơn hàng của tôi
```
GET /api/orders
Authorization: Bearer <token>
```
→ `List<OrderResponse>`

#### Chi tiết đơn hàng
```
GET /api/orders/{id}
Authorization: Bearer <token>
```
→ `OrderResponse`

#### [Admin] Xem tất cả đơn
```
GET /api/admin/orders
Authorization: Bearer <token>  (ADMIN/OWNER)
```
→ `List<OrderResponse>`

#### [Admin] Cập nhật trạng thái đơn
```
PUT /api/admin/orders/{id}/status?status=CONFIRMED
Authorization: Bearer <token>  (ADMIN/OWNER)
```

**Luồng trạng thái:** `PENDING → CONFIRMED → SHIPPING → DELIVERED`  
Hoặc huỷ: bất kỳ → `CANCELLED`

#### [Admin] Nhập IMEI cho sản phẩm
```
PUT /api/admin/order-items/{orderItemId}/imei?imei=123456789012345
Authorization: Bearer <token>  (ADMIN)
```

#### Tra cứu bảo hành (public)
```
GET /api/warranty?imei=123456789012345
```

---

## 11. Address (cần token)

### TypeScript types

```ts
interface AddressResponse {
  id: number
  recipient: string      // tên người nhận
  phone: string
  ward: string           // phường/xã
  district: string       // quận/huyện
  city: string           // tỉnh/thành phố
  line1: string          // số nhà, tên đường
  line2: string | null   // bổ sung (toà nhà, căn hộ...)
  addressType: 'HOME' | 'WORK'
  defaultAddress: boolean
}
```

### Endpoints

#### Danh sách địa chỉ
```
GET /api/users/address
Authorization: Bearer <token>
```
→ `ApiResponse<AddressResponse[]>`

#### Thêm địa chỉ
```
POST /api/users/address
Authorization: Bearer <token>
```
```json
{
  "recipient": "Nguyễn Văn A",
  "phone": "0901234567",
  "ward": "Phường Bến Nghé",
  "district": "Quận 1",
  "city": "TP. Hồ Chí Minh",
  "line1": "123 Đường Lê Lợi",
  "line2": null,
  "addressType": "HOME",
  "defaultAddress": false
}
```
→ `ApiResponse<AddressResponse>`

#### Đặt làm địa chỉ mặc định
```
PATCH /api/users/address/{id}
Authorization: Bearer <token>
```
→ `ApiResponse<AddressResponse>` (không cần body)

#### Cập nhật địa chỉ
```
PUT /api/users/address/{id}
Authorization: Bearer <token>
```
Body giống AddressRequest ở trên.

#### Xóa địa chỉ
```
DELETE /api/users/address/{id}
Authorization: Bearer <token>
```

---

## 12. Voucher

### Endpoints

#### Lấy danh sách voucher (public khi có token)
```
GET /api/vouchers
Authorization: Bearer <token>
```
→ `List<Voucher>` (trả thẳng qua `ResponseEntity`)

```ts
interface Voucher {
  id: number
  code: string
  discountPercent?: number
  discountAmount?: number
  minOrderValue?: number
  expiryDate?: string
}
```

#### [Admin] Tạo voucher
```
POST /api/admin/vouchers
Authorization: Bearer <token>  (ADMIN)
```
Body là object Voucher.

#### [Admin] Xóa voucher
```
DELETE /api/admin/vouchers/{id}
Authorization: Bearer <token>  (ADMIN)
```

---

## 13. Phân quyền tóm tắt

| Role | Quyền |
|---|---|
| `USER` | Xem sản phẩm, giỏ hàng, đặt hàng, quản lý địa chỉ, profile |
| `ADMIN` | Thêm trên + quản lý đơn hàng, nhập IMEI, quản lý voucher, xem danh sách user |
| `OWNER` | Full quyền, bao gồm đổi role user |

---

## 14. Setup Axios cho FE (khuyến nghị)

```ts
// src/api/axiosInstance.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
})

// Tự gắn token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Xử lý lỗi 401 → redirect login
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data ?? error)
  }
)

export default api
```

---

## 15. Auth flow FE hoàn chỉnh

```ts
// 1. Login
const tokenRes = await api.post('/auth/access-token', { username, password })
// tokenRes = { accessToken, refreshToken }  (không bọc ApiResponse)
localStorage.setItem('accessToken', tokenRes.accessToken)

// 2. Lấy user info
const userRes = await api.get('/api/users/me')
// userRes = { status, message, result: UserResponse }
const user = userRes.result

// 3. Kiểm tra role
const isAdmin = user.roleTypes.includes('ADMIN') || user.roleTypes.includes('OWNER')

// 4. Logout
localStorage.removeItem('accessToken')
```

---

## 16. Những điểm quan trọng cần nhớ khi code FE

| # | Vấn đề | Chi tiết |
|---|---|---|
| 1 | **Login response không bọc ApiResponse** | `/auth/access-token` trả thẳng `{ accessToken, refreshToken }`, không có `.result` |
| 2 | **Một số Order/Voucher API trả ResponseEntity** | Không có wrapper `ApiResponse`, lấy thẳng `response.data` |
| 3 | **Page bắt đầu từ 0** | `?page=0` là trang đầu tiên |
| 4 | **Price là BigDecimal → string trong JSON** | Dùng `parseFloat()` hoặc thư viện tiền tệ khi tính toán |
| 5 | **Upload ảnh sản phẩm dùng FormData** | `Content-Type: multipart/form-data`, `images.length === files.length` |
| 6 | **Cart select tách biệt với update quantity** | `PATCH /cart/items/{id}/select` riêng, không gộp |
| 7 | **Chỉ item selected mới vào order** | Lọc `cartItemResponses.filter(i => i.selected)` trước khi tạo order |
| 8 | **CORS đã mở `*`** | FE chạy bất kỳ port nào cũng gọi được |
| 9 | **Token hết hạn sau 30 phút** | Refresh token có hạn 14 ngày (API refresh chưa implement) |
| 10 | **`maxStock` trong CartItem** | Dùng để disable nút tăng số lượng khi đạt tồn kho |
