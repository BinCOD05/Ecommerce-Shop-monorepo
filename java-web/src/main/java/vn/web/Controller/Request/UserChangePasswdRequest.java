package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter

public class UserChangePasswdRequest  implements Serializable {
    private String password ;
    private String newPassword ;
    private String confirmPassword;
}
