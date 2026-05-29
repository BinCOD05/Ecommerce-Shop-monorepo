package vn.web.Controller.Request;

import lombok.*;

import java.io.Serializable;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserPageRequest implements Serializable {
    private String keyword ;
}
