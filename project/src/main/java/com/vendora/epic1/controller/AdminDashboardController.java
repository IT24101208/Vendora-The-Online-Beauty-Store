package com.vendora.epic1.controller;

import com.vendora.common.ApiResponse;
import com.vendora.common.Constants;
import com.vendora.common.PaginationResponse;
import com.vendora.epic1.dto.user.UserDetailsResponse;
import com.vendora.epic1.dto.user.UserSummaryResponse;
import com.vendora.epic1.model.User;
import com.vendora.epic1.model.enums.RoleType;
import com.vendora.epic1.model.enums.UserStatus;
import com.vendora.epic1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constants.ADMIN_BASE + "/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PaginationResponse<UserSummaryResponse>>> getAllUsers(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserSummaryResponse> userPage = userRepository.findAll(pageable)
                .map(this::mapToSummaryResponse);

        return ResponseEntity.ok(
                ApiResponse.success(
                        Constants.USER_LIST_RETRIEVED,
                        PaginationResponse.from(userPage)
                )
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDetailsResponse>> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return ResponseEntity.ok(
                ApiResponse.success(
                        Constants.USER_DETAILS_RETRIEVED,
                        mapToDetailsResponse(user)
                )
        );
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> getUsersByRole(@PathVariable RoleType role) {
        List<UserSummaryResponse> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == role)
                .map(this::mapToSummaryResponse)
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success(
                        Constants.USER_LIST_RETRIEVED,
                        users
                )
        );
    }

    @GetMapping("/users/status/{status}")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> getUsersByStatus(@PathVariable UserStatus status) {
        List<UserSummaryResponse> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getStatus() == status)
                .map(this::mapToSummaryResponse)
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success(
                        Constants.USER_LIST_RETRIEVED,
                        users
                )
        );
    }

    private UserSummaryResponse mapToSummaryResponse(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(buildFullName(user.getFirstName(), user.getLastName()))
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private UserDetailsResponse mapToDetailsResponse(User user) {
        return UserDetailsResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(buildFullName(user.getFirstName(), user.getLastName()))
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getIsEmailVerified())
                .accountNonLocked(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(null)
                .build();
    }

    private String buildFullName(String firstName, String lastName) {
        String first = firstName == null ? "" : firstName.trim();
        String last = lastName == null ? "" : lastName.trim();
        return (first + " " + last).trim();
    }
}
