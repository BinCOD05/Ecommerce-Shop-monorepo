package vn.web.Converter;


import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Request.UserUpdateRequest;
import vn.web.Model.AddressEntity;
import vn.web.Model.UserEntity;

//E : Enitty , D: Request , R: Response
public interface GenericMapper<E , D ,  R> {

//    ENTITY -> RESPONSE
    R toDTOResponse(E entity);

    E toEntity(D request);



    //    NullValuePropertyMappingStrategy.IGNORE này là nếu giá trị truyền đến từ FE là null thì sẽ k thay đổi Data của Entity
    //    UserEntity toUserEntity(UserCreationRequest userCreationRequest);
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateEntity(@MappingTarget E entity, D request );
//

}
