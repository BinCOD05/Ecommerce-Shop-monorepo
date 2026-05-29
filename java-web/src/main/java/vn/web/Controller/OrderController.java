package vn.web.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.web.Controller.Request.OrderRequest;
import vn.web.Services.OrderService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── User endpoints ──────────────────────────────────────────────

    @Operation(summary = "Tạo đơn hàng từ các cart item đã selected")
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @Operation(summary = "Lấy danh sách đơn hàng của tôi")
    @GetMapping("/orders")
    public ResponseEntity<?> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @Operation(summary = "Chi tiết đơn hàng (chỉ xem đơn của chính mình)")
    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @Operation(summary = "Tra cứu bảo hành theo IMEI (public)")
    @GetMapping("/warranty")
    public ResponseEntity<?> checkWarranty(@RequestParam String imei) {
        return ResponseEntity.ok(orderService.checkWarranty(imei));
    }

    // ── Admin endpoints ─────────────────────────────────────────────

    @Operation(summary = "Xem tất cả đơn hàng (Admin)")
    @GetMapping("/admin/orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @Operation(summary = "Cập nhật trạng thái đơn hàng (Admin)")
    @PutMapping("/admin/orders/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @Operation(summary = "Nhập IMEI cho sản phẩm trong đơn hàng (Admin)")
    @PutMapping("/admin/order-items/{id}/imei")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> inputImei(
            @PathVariable Long id,
            @RequestParam String imei) {
        orderService.inputImei(id, imei);
        return ResponseEntity.ok("Đã cập nhật IMEI thành công");
    }
}
