package vn.web.Controller.Request;

import lombok.*;
import vn.web.Common.Gender;

import java.io.Serializable;

@Getter
@Setter
public class UserUpdateRequest implements Serializable {
    private String fullName ;
    private String phone ;
    private String email;
    private Gender gender;
}
