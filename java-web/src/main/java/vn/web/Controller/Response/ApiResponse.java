package vn.web.Controller.Response;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class  ApiResponse<T> {
    @Builder.Default
    private int status  = 200;
    private String message ;
    private T result ;
}
