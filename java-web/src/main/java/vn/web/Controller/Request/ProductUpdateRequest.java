package vn.web.Controller.Request;

import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ProductUpdateRequest implements Serializable {
    private String name;
    private BigDecimal price;

    private String color;
    private String storage;
    private String description;
    private Long stock;
    private Boolean isActive;
}