package com.lending.backend.service;

import com.lending.backend.dto.UserResponse;
import com.lending.backend.entity.User;
import java.util.List;

public interface UserService {

  UserResponse register(User user);

  User getById(Long id);

  UserResponse updateStatus(Long id, com.lending.backend.enums.UserStatus status);

  void changePassword(Long id, String oldPassword, String newPassword);

  List<User> getAll();
}
