package vn.web.Controller.Request;

import lombok.Getter;
import lombok.Setter;
import vn.web.Common.RoleType;

import java.io.Serializable;

@Getter
@Setter
public class RoleChangeRequest implements Serializable {
    private RoleType roleType;
}
