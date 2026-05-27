package com.lending.backend.service;

import com.lending.backend.entity.User;
import com.lending.backend.entity.User;
import java.util.List;

public interface UserService {

  User register(User user);

  User getById(Long id);

  User updateStatus(Long id, com.lending.backend.enums.UserStatus status);

  List<User> getAll();
}
