package vn.web.Controller.Request;


import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class AddCartRequest implements Serializable {
    private Long productId ;
    private Long quantity ;
}
