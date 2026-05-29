package vn.web.Controller.Response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class CategoryResponse implements Serializable {
    private Long id ;
    private String name ;
    private Long parentId;
}
