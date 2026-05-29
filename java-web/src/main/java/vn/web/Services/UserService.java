package vn.web.Services;

import org.springframework.data.domain.Pageable;
import vn.web.Common.RoleType;
import vn.web.Controller.Request.*;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.UserResponse;

public interface UserService {

     UserResponse getUser(long id);

     PageResponse<UserResponse> findALl(UserPageRequest req , Pageable pageable);

     UserResponse save(UserCreationRequest req);

     UserResponse update(UserUpdateRequest req , long id);

     void delete(long id);

     void changePassword(UserChangePasswdRequest req , long id);

//   chinh role boi admin
     UserResponse changeRole(RoleType role , long id);
}
