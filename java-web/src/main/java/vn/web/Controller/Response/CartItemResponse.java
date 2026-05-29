package vn.web.Controller.Response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
public class CartItemResponse implements Serializable {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String color ;
    private BigDecimal price;
    private Long quantity;
    private Boolean selected;
    // Hữu ích cho Frontend validate
    private Long maxStock;
}
