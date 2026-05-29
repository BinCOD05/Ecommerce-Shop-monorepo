package vn.web.Services.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.web.Common.TokenType;
import vn.web.Services.JwtService;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.expiryMinute}")
    private long expiryMinute;

    @Value("${jwt.expiryDay}")
    private long expiryDay;

    @Value("${jwt.accessKey}")
    private String accessKey;

    @Value("${jwt.refreshKey}")
    private String refreshKey;

    @Override
    public String generateAccessToken(long userId, String username, List<String> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", authorities);
        return buildToken(claims, username, expiryMinute * 60 * 1000L, TokenType.ACCESS_TOKEN);
    }

    @Override
    public String generateRefreshToken(long userId, String username, List<String> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", authorities);
        return buildToken(claims, username, expiryDay * 24 * 60 * 60 * 1000L, TokenType.REFRESH_TOKEN);
    }

    @Override
    public String extractUsername(String token, TokenType type) {
        return extractClaim(token, type, Claims::getSubject);
    }

    private <T> T extractClaim(String token, TokenType type, Function<Claims, T> resolver) {
        return resolver.apply(parseAllClaims(token, type));
    }

    private Claims parseAllClaims(String token, TokenType type) {
        try {
            return Jwts.parser()
                    .setSigningKey(getKey(type))
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token đã hết hạn", e);
        } catch (SignatureException e) {
            throw new RuntimeException("Chữ ký token không hợp lệ", e);
        }
    }

    private String buildToken(Map<String, Object> claims, String subject, long ttlMs, TokenType type) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ttlMs))
                .signWith(getKey(type), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getKey(TokenType type) {
        String keyStr = (type == TokenType.REFRESH_TOKEN) ? refreshKey : accessKey;
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(keyStr));
    }
}
