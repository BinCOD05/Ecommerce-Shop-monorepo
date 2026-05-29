package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
public class SignInRequest implements Serializable {
    private String username ;
    private String password ;
}
