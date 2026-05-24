package com.lending.backend.service.impl;

import com.lending.backend.dto.RegisterRequest;
import com.lending.backend.entity.User;
import com.lending.backend.enums.UserRole;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .studentId(request.getStudentId())
                .phone(request.getPhone())
                .role(UserRole.student)
                .isActive(true)
                .emailVerified(false)
                .build();

        userRepository.save(user);
    }
}
