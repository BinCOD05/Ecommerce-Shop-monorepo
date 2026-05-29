package vn.web.Services;

import org.springframework.security.core.GrantedAuthority;
import vn.web.Common.TokenType;
import vn.web.Controller.Request.SignInRequest;

import java.util.Collection;
import java.util.List;

public interface JwtService {
    String generateAccessToken(long userid , String username , List<String> authorities);
    String generateRefreshToken(long userId , String userName ,  List<String> authorities);

    String extractUsername(String token , TokenType type);

}
