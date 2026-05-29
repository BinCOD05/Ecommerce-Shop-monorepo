package vn.web.Controller.Response;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import vn.web.Model.Product;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponse implements Serializable {
    private Long id ;
    private String name ;
    private String description;
    private String  color ;
    private String storage ;
    private BigDecimal price;
    private Set<ProductImage> images;
    private Set<ProductSpec> specs;

    private Long stock ;

    private CategoryResponse category ;
    private BrandResponse brand ;

    @Data
    public static class ProductSpec {
        private Long id ;
        private String name ;
        private String value ;
    }
    @Data
    public static class ProductImage{
        private Long id ;
        private String imageUrl ;
        private Boolean primary ;
        private Long sortOrder ;
    }
}
