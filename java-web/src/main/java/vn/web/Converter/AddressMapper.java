package vn.web.Converter;

import org.mapstruct.*;
import vn.web.Controller.Request.AddressRequest;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Response.AddressResponse;
import vn.web.Model.AddressEntity;


@Mapper(componentModel = "spring")
public interface AddressMapper extends GenericMapper<AddressEntity , AddressRequest , AddressResponse> {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateAddress(@MappingTarget AddressEntity address, AddressUpdateRequest request);

}
