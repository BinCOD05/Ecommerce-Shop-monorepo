package vn.web.Controller.Request;


import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class ProductFilterSearch implements Serializable {
    private String keyword ;
    private Long brandId ;
    private Long categoryId ;
    private Long minPrice ;
    private Long maxPrice ;
}
