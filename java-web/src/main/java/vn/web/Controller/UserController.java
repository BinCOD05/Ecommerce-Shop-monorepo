package vn.web.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.web.Common.RoleType;
import vn.web.Controller.Request.*;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.UserResponse;
import vn.web.Services.UserService;
import vn.web.Util.SecurityUtils;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Lấy thông tin cá nhân")
    @GetMapping("/me")
    public ApiResponse<UserResponse> getProfile() {
        long currentId = SecurityUtils.getCurrentId();
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin thành công")
                .result(userService.getUser(currentId))
                .build();
    }

    @Operation(summary = "Lấy thông tin user theo ID (Admin)")
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<UserResponse> getUser(@PathVariable long id) {
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin thành công")
                .result(userService.getUser(id))
                .build();
    }

    @Operation(summary = "Cập nhật thông tin cá nhân")
    @PutMapping("/upd")
    public ApiResponse<UserResponse> updateUser(@RequestBody UserUpdateRequest request) {
        long currentId = SecurityUtils.getCurrentId();
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông tin thành công")
                .result(userService.update(request, currentId))
                .build();
    }

    @Operation(summary = "Đổi mật khẩu")
    @PatchMapping("/change-pwd")
    public ApiResponse<Void> changePasswd(@RequestBody UserChangePasswdRequest request) {
        long currentId = SecurityUtils.getCurrentId();
        userService.changePassword(request, currentId);
        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Đổi mật khẩu thành công")
                .build();
    }

    @Operation(summary = "Xóa user (Admin)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> deleteUser(@PathVariable long id) {
        userService.delete(id);
        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa user thành công")
                .build();
    }

    @Operation(summary = "Tìm kiếm/danh sách user (Admin)")
    @PostMapping("/search")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<PageResponse<UserResponse>> findAll(
            @RequestBody(required = false) UserPageRequest request,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        UserPageRequest req = (request != null) ? request : new UserPageRequest();
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách thành công")
                .result(userService.findALl(req, pageable))
                .build();
    }

    @Operation(summary = "Đổi role user (Admin/Owner)")
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<UserResponse> updateRole(@RequestBody RoleChangeRequest request, @PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật quyền thành công")
                .result(userService.changeRole(request.getRoleType(), id))
                .build();
    }
}
