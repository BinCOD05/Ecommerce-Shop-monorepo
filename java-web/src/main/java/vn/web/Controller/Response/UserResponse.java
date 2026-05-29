package vn.web.Controller.Response;


import lombok.*;
import vn.web.Common.Gender;
import vn.web.Common.RoleType;
import vn.web.Model.AddressEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserResponse {
    private Long id ;
    private String username;
    private String fullName;
    private String email ;
    private String phone ;
    private Gender gender ;
    private Set<RoleType> roleTypes;
    private LocalDateTime createdAt ;
//    private List<AddressEntity> addressEntityList;
}
