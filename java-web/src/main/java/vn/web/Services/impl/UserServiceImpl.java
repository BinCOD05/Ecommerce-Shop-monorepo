package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.web.Common.RoleType;
import vn.web.Controller.Request.*;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.UserResponse;
import vn.web.Converter.UserMapper;
import vn.web.Exception.ResourceNotFoundException;
import vn.web.Model.Role;
import vn.web.Model.UserEntity;
import vn.web.Repository.RoleRepository;
import vn.web.Repository.UserRepository;
import vn.web.Services.UserService;
import vn.web.Util.UserSpecs;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse getUser(long id) {
        UserEntity user = getUserEntity(id);
        return toResponse(user);
    }

    @Override
    public PageResponse<UserResponse> findALl(UserPageRequest req, Pageable pageable) {
        Specification<UserEntity> spec = UserSpecs.search(req);
        Page<UserEntity> page = userRepository.findAll(spec, pageable);

        List<UserResponse> data = page.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
                .page(pageable.getPageNumber())
                .size(page.getSize())
                .totalElement(page.getTotalElements())
                .totalPage(page.getTotalPages())
                .content(data)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse save(UserCreationRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại: " + req.getUsername());
        }

        UserEntity user = userMapper.toEntity(req);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleType.OWNER)
                .orElseThrow(() -> new ResourceNotFoundException("Role OWNER chưa được tạo trong DB"));
        user.getRolesSet().add(userRole);

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse update(UserUpdateRequest req, long id) {
        UserEntity user = getUserEntity(id);
        userMapper.updateUser(user, req);
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(long id) {
        UserEntity user = getUserEntity(id);
        userRepository.delete(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePassword(UserChangePasswdRequest req, long id) {
        UserEntity user = getUserEntity(id);

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu mới không khớp với xác nhận");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse changeRole(RoleType roleType, long id) {
        UserEntity user = getUserEntity(id);
        Role newRole = roleRepository.findByName(roleType)
                .orElseThrow(() -> new ResourceNotFoundException("Role không tồn tại: " + roleType));
        user.getRolesSet().add(newRole);
        return toResponse(userRepository.save(user));
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private UserEntity getUserEntity(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private UserResponse toResponse(UserEntity user) {
        UserResponse response = userMapper.toDTOResponse(user);
        Set<RoleType> roles = user.getRolesSet().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        response.setRoleTypes(roles);
        return response;
    }
}
