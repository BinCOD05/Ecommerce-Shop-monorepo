package vn.web.Controller.Response;

import lombok.Getter;
import lombok.Setter;
import vn.web.Common.OrderStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrderResponse implements Serializable {
    private Long id;
    private String code;
    private String status;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;

    // Thông tin người nhận (lấy từ address, không phải tài khoản)
    private String name;
    private String phoneNumber;

    // Địa chỉ giao hàng dạng string đã format
    private String address;

    // Ghi chú đơn hàng
    private String note;

    private List<OrderItemResponse> orderItems;
}
