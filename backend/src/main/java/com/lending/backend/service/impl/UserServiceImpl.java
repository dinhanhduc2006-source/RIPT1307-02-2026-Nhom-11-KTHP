package com.lending.backend.service.impl;

import com.lending.backend.dto.UserResponse;
import com.lending.backend.entity.User;
import com.lending.backend.enums.UserStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.mapper.UserMapper;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent() ||
            userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getStatus() == null) user.setStatus(UserStatus.Active);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    @Transactional
    public UserResponse updateStatus(Long id, UserStatus status) {
        User user = getById(id);
        user.setStatus(status);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = getById(id);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateProfile(Long id, User data) {
        User user = getById(id);
        user.setUsername(data.getUsername());
        user.setEmail(data.getEmail());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User uploadAvatar(Long id, org.springframework.web.multipart.MultipartFile file) {
        User user = getById(id);
        try {
            byte[] bytes = file.getBytes();
            String base64 = "data:" + file.getContentType() + ";base64," + 
                          java.util.Base64.getEncoder().encodeToString(bytes);
            user.setAvatar(base64);
            return userRepository.save(user);
        } catch (java.io.IOException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}
