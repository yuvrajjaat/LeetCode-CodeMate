package com.leetcodemate.controller;

import com.leetcodemate.dto.UserDetailResponse;
import com.leetcodemate.model.User;
import com.leetcodemate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDetailResponse> getUserByUsername(@PathVariable String username) {
        UserDetailResponse detail = userService.getUserDetail(username);
        if (detail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detail);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        User user = userService.createUser(username);
        return ResponseEntity.ok(user);
    }
}
