package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;


@Getter
@Setter

public class OrderRequest implements Serializable {
    private Long addressId ;
    private String note ;
    private List<Long> cartItemIds ;

    private String voucherCode;
}
