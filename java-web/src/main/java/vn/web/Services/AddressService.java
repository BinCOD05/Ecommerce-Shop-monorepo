package vn.web.Services;

import vn.web.Controller.Request.AddressRequest;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Response.AddressResponse;
import vn.web.Model.AddressEntity;

import java.util.List;
import java.util.Optional;

public interface AddressService {
    AddressResponse addNewAddress(AddressRequest req);

    List<AddressResponse> getListAddress();


    AddressResponse setDefaultAddress(long userId , long addressId);

    AddressResponse updateAddress(long userId , long addressId , AddressUpdateRequest req);

    void deleteAddress(long userId , long addressId) ;
}
