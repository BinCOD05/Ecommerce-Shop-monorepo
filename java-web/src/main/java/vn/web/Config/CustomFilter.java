package vn.web.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import vn.web.Common.TokenType;
import vn.web.Services.CustomUserDetailsService;
import vn.web.Services.JwtService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        // Phải có dấu cách: "Bearer <token>"
        if (!StringUtils.hasLength(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String username = jwtService.extractUsername(token, TokenType.ACCESS_TOKEN);
            log.debug("JWT filter — user: {}", username);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            SecurityContext ctx = SecurityContextHolder.createEmptyContext();
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            ctx.setAuthentication(auth);
            SecurityContextHolder.setContext(ctx);
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
            // Không throw — để Spring Security xử lý 401 tự nhiên
        }

        filterChain.doFilter(request, response);
    }
}
