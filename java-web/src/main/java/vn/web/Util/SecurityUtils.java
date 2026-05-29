package vn.web.Util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.web.Model.UserEntity;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UserEntity getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserEntity user) {
            return user;
        }
        return null;
    }

    /** Ném exception nếu chưa đăng nhập — dùng ở các endpoint cần auth. */
    public static UserEntity requireCurrentUser() {
        UserEntity user = getCurrentUser();
        if (user == null) {
            throw new RuntimeException("Chưa đăng nhập hoặc token không hợp lệ");
        }
        return user;
    }

    public static long getCurrentId() {
        return requireCurrentUser().getId();
    }
}
