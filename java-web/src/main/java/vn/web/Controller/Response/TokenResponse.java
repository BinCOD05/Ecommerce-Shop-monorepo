package vn.web.Controller.Response;

import lombok.*;

import java.io.Serializable;



@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TokenResponse implements Serializable {
    private String accessToken ;
    private String refreshToken ;
}
