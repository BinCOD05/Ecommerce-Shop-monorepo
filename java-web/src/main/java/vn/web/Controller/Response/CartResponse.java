package vn.web.Controller.Response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class CartResponse implements Serializable {
    private Long id;
    private List<CartItemResponse> cartItemResponses;
    private Long totalItems;
    private BigDecimal totalPrice;
}
