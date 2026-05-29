package vn.web.Controller.Response;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> implements Serializable {
    private Integer page ;
    private Integer size;
    private Integer totalPage ;
    private Long totalElement ;
    List<T> content ;

}
