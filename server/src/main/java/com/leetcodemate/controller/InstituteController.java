package com.leetcodemate.controller;

import com.leetcodemate.dto.FriendDetailResponse;
import com.leetcodemate.model.Institute;
import com.leetcodemate.model.User;
import com.leetcodemate.service.InstituteService;
import com.leetcodemate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/institutes")
public class InstituteController {

    private final InstituteService instituteService;
    private final UserService userService;

    public InstituteController(InstituteService instituteService, UserService userService) {
        this.instituteService = instituteService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Institute>> getAllInstitutes() {
        return ResponseEntity.ok(instituteService.getAllInstitutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Institute> getInstituteById(@PathVariable Long id) {
        Optional<Institute> institute = instituteService.getInstituteById(id);
        return institute.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Institute> createInstitute(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String name = body.get("name");
        String city = body.get("city");
        String logo = body.get("logo");

        if (username == null || name == null || city == null) {
            return ResponseEntity.badRequest().build();
        }

        Institute institute = instituteService.createInstitute(username, name, city, logo);
        return ResponseEntity.ok(institute);
    }

    @PutMapping("/set")
    public ResponseEntity<User> setUserInstitute(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        Object instituteIdObj = body.get("instituteId");

        if (username == null || instituteIdObj == null) {
            return ResponseEntity.badRequest().build();
        }

        Long instituteId;
        if (instituteIdObj instanceof Number) {
            instituteId = ((Number) instituteIdObj).longValue();
        } else {
            instituteId = Long.parseLong(instituteIdObj.toString());
        }

        User user = instituteService.setUserInstitute(username, instituteId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/leave")
    public ResponseEntity<User> leaveInstitute(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null) {
            return ResponseEntity.badRequest().build();
        }
        User user = instituteService.leaveInstitute(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/batchmates/{username}")
    public ResponseEntity<List<FriendDetailResponse>> getBatchmates(@PathVariable String username) {
        Optional<User> optionalUser = userService.findByUsername(username);
        if (optionalUser.isEmpty() || optionalUser.get().getInstitute() == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        User user = optionalUser.get();
        Long instituteId = user.getInstitute().getId();
        List<User> students = userService.findByInstituteId(instituteId);

        List<FriendDetailResponse> batchmates = new ArrayList<>();
        for (User student : students) {
            FriendDetailResponse detail = userService.buildFriendDetail(student.getUsername());
            if (detail != null) {
                batchmates.add(detail);
            }
        }

        return ResponseEntity.ok(batchmates);
    }
}
