package vn.web.Controller.Response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class CategoryTreeResponse implements Serializable {
    private Long id ;
    private String name ;
    private List<CategoryTreeResponse> children;
}
