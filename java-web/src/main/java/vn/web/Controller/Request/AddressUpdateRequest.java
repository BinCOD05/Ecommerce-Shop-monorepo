package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;
import vn.web.Common.AddressType;


@Getter
@Setter
public class AddressUpdateRequest {
    private String recipient ;

    private String phone ;

    private String ward ;

    private String city ;

    private String line1 ;

    private String line2 ;

    private String district;

    private AddressType addressType ;
}
