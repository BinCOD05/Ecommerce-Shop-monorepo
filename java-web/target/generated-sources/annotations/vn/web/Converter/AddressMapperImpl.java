package vn.web.Converter;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.web.Controller.Request.AddressRequest;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Response.AddressResponse;
import vn.web.Model.AddressEntity;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-30T14:16:48+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressResponse toDTOResponse(AddressEntity entity) {
        if ( entity == null ) {
            return null;
        }

        AddressResponse.AddressResponseBuilder addressResponse = AddressResponse.builder();

        addressResponse.id( entity.getId() );
        addressResponse.recipient( entity.getRecipient() );
        addressResponse.phone( entity.getPhone() );
        addressResponse.ward( entity.getWard() );
        addressResponse.city( entity.getCity() );
        addressResponse.line1( entity.getLine1() );
        addressResponse.line2( entity.getLine2() );
        addressResponse.district( entity.getDistrict() );
        addressResponse.addressType( entity.getAddressType() );
        addressResponse.defaultAddress( entity.isDefaultAddress() );

        return addressResponse.build();
    }

    @Override
    public AddressEntity toEntity(AddressRequest request) {
        if ( request == null ) {
            return null;
        }

        AddressEntity addressEntity = new AddressEntity();

        addressEntity.setRecipient( request.getRecipient() );
        addressEntity.setPhone( request.getPhone() );
        addressEntity.setWard( request.getWard() );
        addressEntity.setCity( request.getCity() );
        addressEntity.setLine1( request.getLine1() );
        addressEntity.setLine2( request.getLine2() );
        addressEntity.setDistrict( request.getDistrict() );
        addressEntity.setAddressType( request.getAddressType() );
        addressEntity.setDefaultAddress( request.isDefaultAddress() );

        return addressEntity;
    }

    @Override
    public void updateAddress(AddressEntity address, AddressUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getRecipient() != null ) {
            address.setRecipient( request.getRecipient() );
        }
        if ( request.getPhone() != null ) {
            address.setPhone( request.getPhone() );
        }
        if ( request.getWard() != null ) {
            address.setWard( request.getWard() );
        }
        if ( request.getCity() != null ) {
            address.setCity( request.getCity() );
        }
        if ( request.getLine1() != null ) {
            address.setLine1( request.getLine1() );
        }
        if ( request.getLine2() != null ) {
            address.setLine2( request.getLine2() );
        }
        if ( request.getDistrict() != null ) {
            address.setDistrict( request.getDistrict() );
        }
        if ( request.getAddressType() != null ) {
            address.setAddressType( request.getAddressType() );
        }
    }
}
