package vn.web.Controller.Request;


import lombok.*;
import vn.web.Controller.Response.ProductDetailResponse;
import vn.web.Model.Product;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCreationRequest implements Serializable {
    private String name;
    private String color;
    private String storage;
    private BigDecimal price;
    private String description;
    private Boolean isActive;
    private Long brandId;
    private Long categoryId;
    private List<ProductSpecReqDTO> specs;
    private List<ProductImageReqDTO> images;
    private Long stock  ;
    @Data
    public static class ProductSpecReqDTO {
        private String name;
        private String value;
    }
    @Data
    public static class ProductImageReqDTO {
        private Boolean primary;
        private Integer sortOrder;
    }
}
