package vn.web.Converter;


import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import vn.web.Controller.Request.UserCreationRequest;
import vn.web.Controller.Request.UserUpdateRequest;
import vn.web.Controller.Response.UserResponse;
import vn.web.Model.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper extends GenericMapper<UserEntity , UserCreationRequest, UserResponse> {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget UserEntity user, UserUpdateRequest request);


}
