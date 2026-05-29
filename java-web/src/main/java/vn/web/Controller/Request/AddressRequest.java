package vn.web.Controller.Request;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.web.Common.AddressType;
import vn.web.Model.UserEntity;

import java.io.Serializable;



@Getter
@Setter
public class AddressRequest implements Serializable {

    private String recipient ;

    private String phone ;

    private String ward ;

    private String city ;

    private String line1 ;

    private String line2 ;

    private String district;

    private AddressType  addressType ;

    private boolean  defaultAddress ;

}
