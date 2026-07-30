package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.UserRequest;
import com.trillion.trader.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {
    PagedResponse<UserResponse> getAllUsers(Pageable pageable, String search);
    UserResponse getUserById(String id);
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(String id, UserRequest request);
    void deleteUser(String id);
    UserResponse toggleUserStatus(String id);
}
