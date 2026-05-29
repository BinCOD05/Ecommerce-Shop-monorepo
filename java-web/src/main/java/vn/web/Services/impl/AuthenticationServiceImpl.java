package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import vn.web.Controller.Request.SignInRequest;
import vn.web.Controller.Response.TokenResponse;
import vn.web.Exception.ResourceNotFoundException;
import vn.web.Model.UserEntity;
import vn.web.Repository.UserRepository;
import vn.web.Services.AuthenticationService;
import vn.web.Services.JwtService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    @Override
    public TokenResponse getAccessToken(SignInRequest req) {
        // Xác thực username/password qua Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        log.info("Authenticated: {} — roles: {}", req.getUsername(), authentication.getAuthorities());

        // Lấy danh sách role dưới dạng List<String>
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        UserEntity user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUsername()));

        String accessToken  = jwtService.generateAccessToken(user.getId(), req.getUsername(), authorities);
        String refreshToken = jwtService.generateRefreshToken(user.getId(), req.getUsername(), authorities);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public TokenResponse getRefreshToken(String refreshToken) {
        // TODO: implement refresh token rotation
        return null;
    }
}
