package vn.web.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.web.Controller.Request.SignInRequest;
import vn.web.Controller.Request.UserCreationRequest;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Controller.Response.TokenResponse;
import vn.web.Controller.Response.UserResponse;
import vn.web.Services.AuthenticationService;
import vn.web.Services.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @Operation(summary = "Đăng nhập — trả về access token + refresh token")
    @PostMapping("/access-token")
    public TokenResponse login(@RequestBody SignInRequest request) {
        return authenticationService.getAccessToken(request);
    }

    @Operation(summary = "Đăng ký tài khoản mới")
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Đăng ký thành công")
                .result(userService.save(request))
                .build();
    }
}
