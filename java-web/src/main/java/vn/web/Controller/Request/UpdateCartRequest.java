package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class UpdateCartRequest implements Serializable {
    private Long quantity ;
}
