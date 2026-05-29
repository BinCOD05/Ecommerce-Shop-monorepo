package vn.web.Controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.web.Controller.Request.AddressRequest;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Response.AddressResponse;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Repository.AddressRepository;
import vn.web.Services.AddressService;
import vn.web.Util.SecurityUtils;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/users/address")
@Tag(name = "AddressController")
public class AddressController {

    private final AddressService addressService ;

    @GetMapping
    public ApiResponse<List<AddressResponse>> getListAddress(){
        List<AddressResponse> result = addressService.getListAddress();
        return ApiResponse.<List<AddressResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("get List of Address successful")
                .result(result)
                .build();

    }

    @PostMapping
    public ApiResponse<AddressResponse> addNewAddress(@RequestBody AddressRequest request){
        return ApiResponse.<AddressResponse>builder()
                .status(HttpStatus.OK.value())
                .message("add new address successful")
                .result(addressService.addNewAddress(request))
                .build();
    }

    @PatchMapping(value = "/{id}")
    public ApiResponse<AddressResponse> setDefault(@PathVariable Long id){
        long currentId = SecurityUtils.getCurrentId();
        return ApiResponse.<AddressResponse>builder()
                .status(HttpStatus.OK.value())
                .message("set default address successful")
                .result(addressService.setDefaultAddress(currentId , id))
                .build();
    }

    @Operation(summary = "Update address information" ,tags = "Update address")
    @PutMapping(value = "/{id}")
    public ApiResponse<AddressResponse> updateAddress(@RequestBody AddressUpdateRequest request ,
                                                      @PathVariable Long id){
        long currentId = SecurityUtils.getCurrentId();
        return  ApiResponse.<AddressResponse>builder()
                .status(HttpStatus.OK.value())
                .message("update Address successful")
                .result(addressService.updateAddress(currentId , id , request))
                .build();
    }

    @DeleteMapping(value = "/{id}")
    public ApiResponse<AddressResponse> deleteAddress(@PathVariable Long id){
        long currentId = SecurityUtils.getCurrentId();
        addressService.deleteAddress(currentId ,id );
        return ApiResponse.<AddressResponse>builder()
                .status(HttpStatus.OK.value())
                .message("delete address successful")
                .build();
    }

}
