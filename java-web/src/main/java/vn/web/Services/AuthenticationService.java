package vn.web.Services;

import vn.web.Controller.Request.SignInRequest;
import vn.web.Controller.Response.TokenResponse;

public interface AuthenticationService {
    TokenResponse getAccessToken(SignInRequest req);
    TokenResponse getRefreshToken(String refreshToken);
}
