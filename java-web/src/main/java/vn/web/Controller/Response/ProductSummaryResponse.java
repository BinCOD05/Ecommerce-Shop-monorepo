package vn.web.Controller.Response;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse implements Serializable {
    private Long id ;
    private String name ;
    private BigDecimal price ;
    private String brandName ;
    private String categoryName;
    private String  color ;
    private String thumbnailUrl ;
    private Long stock ;
    private Long categoryId;
    private Long brandId;
}
