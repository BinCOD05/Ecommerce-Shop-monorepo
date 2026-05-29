package vn.web.Controller.Request;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import vn.web.Common.Gender;
import vn.web.Common.UserStatus;
import vn.web.Model.AddressEntity;

import java.io.Serializable;
import java.util.List;


@Getter
@Builder
@Setter
public class UserCreationRequest implements Serializable {

    private String username;

    private String fullName;

    private String password;

    private String phone;

    private String email;

}