package com.leetcodemate.controller;

import com.leetcodemate.dto.FriendDetailResponse;
import com.leetcodemate.model.User;
import com.leetcodemate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final UserService userService;

    public FriendController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> addFriend(@RequestBody Map<String, String> body) {
        String userUsername = body.get("userUsername");
        String friendUsername = body.get("friendUsername");

        if (userUsername == null || friendUsername == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.addFriend(userUsername, friendUsername);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping
    public ResponseEntity<User> removeFriend(@RequestBody Map<String, String> body) {
        String userUsername = body.get("userUsername");
        String friendUsername = body.get("friendUsername");
        if (userUsername == null || friendUsername == null) {
            return ResponseEntity.badRequest().build();
        }
        User user = userService.removeFriend(userUsername, friendUsername);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<FriendDetailResponse>> getFriends(@PathVariable String username) {
        List<FriendDetailResponse> friends = userService.getFriendsWithProfiles(username);
        return ResponseEntity.ok(friends);
    }
}
