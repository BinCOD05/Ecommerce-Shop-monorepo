package vn.web.Converter;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.web.Controller.Request.UserCreationRequest;
import vn.web.Controller.Request.UserUpdateRequest;
import vn.web.Controller.Response.UserResponse;
import vn.web.Model.UserEntity;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-29T15:14:24+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toDTOResponse(UserEntity entity) {
        if ( entity == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.id( entity.getId() );
        userResponse.username( entity.getUsername() );
        userResponse.fullName( entity.getFullName() );
        userResponse.email( entity.getEmail() );
        userResponse.phone( entity.getPhone() );
        userResponse.gender( entity.getGender() );
        userResponse.createdAt( entity.getCreatedAt() );

        return userResponse.build();
    }

    @Override
    public UserEntity toEntity(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        UserEntity userEntity = new UserEntity();

        userEntity.setUsername( request.getUsername() );
        userEntity.setPassword( request.getPassword() );
        userEntity.setFullName( request.getFullName() );
        userEntity.setPhone( request.getPhone() );
        userEntity.setEmail( request.getEmail() );

        return userEntity;
    }

    @Override
    public void updateUser(UserEntity user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getFullName() != null ) {
            user.setFullName( request.getFullName() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getGender() != null ) {
            user.setGender( request.getGender() );
        }
    }
}
