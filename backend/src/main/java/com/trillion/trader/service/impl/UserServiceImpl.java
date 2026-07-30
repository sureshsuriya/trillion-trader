package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.UserRequest;
import com.trillion.trader.dto.response.UserResponse;
import com.trillion.trader.exception.BadRequestException;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.User;
import com.trillion.trader.repository.UserRepository;
import com.trillion.trader.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PagedResponse<UserResponse> getAllUsers(Pageable pageable, String search) {
        // Simple pagination for MVP. Search can be implemented using MongoTemplate if needed
        Page<User> users = userRepository.findAll(pageable);
        Page<UserResponse> mappedPage = users.map(this::mapToResponse);
        return PagedResponse.of(mappedPage);
    }

    @Override
    public UserResponse getUserById(String id) {
        User user = findUserOrThrow(id);
        return mapToResponse(user);
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .roles(request.getRoles())
                .active(request.isActive())
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request) {
        User user = findUserOrThrow(id);

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRoles(request.getRoles());
        user.setActive(request.isActive());
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(String id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }

    @Override
    public UserResponse toggleUserStatus(String id) {
        User user = findUserOrThrow(id);
        user.setActive(!user.isActive());
        return mapToResponse(userRepository.save(user));
    }

    // Helper method for mapping
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private User findUserOrThrow(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
