package vn.web.Controller.Response;

import lombok.*;
import vn.web.Common.AddressType;

import java.io.Serializable;



@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AddressResponse   implements Serializable {

    private Long id ;

    private String recipient ;

    private String phone ;

    private String ward ;

    private String city ;

    private String line1 ;

    private String line2 ;

    private String district;

    private AddressType  addressType ;

    private boolean defaultAddress ;
}
