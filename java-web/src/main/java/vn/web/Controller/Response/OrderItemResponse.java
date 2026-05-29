package vn.web.Controller.Response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemResponse {
    private Long id;
    private String productName;
    private Long quantity;
    private BigDecimal price;
    private String imei;

    // Ảnh thumbnail của sản phẩm (ảnh primary)
    private String productImage;
}
