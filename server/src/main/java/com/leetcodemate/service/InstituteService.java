package com.leetcodemate.service;

import com.leetcodemate.model.Institute;
import com.leetcodemate.model.User;
import com.leetcodemate.repository.InstituteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InstituteService {

    private final InstituteRepository instituteRepository;
    private final UserService userService;

    public InstituteService(InstituteRepository instituteRepository, UserService userService) {
        this.instituteRepository = instituteRepository;
        this.userService = userService;
    }

    public List<Institute> getAllInstitutes() {
        return instituteRepository.findAll();
    }

    public Optional<Institute> getInstituteById(Long id) {
        return instituteRepository.findById(id);
    }

    @Transactional
    public Institute createInstitute(String username, String name, String city, String logo) {
        Institute institute = new Institute(name, city, logo);
        institute.setStudentCount(1);
        institute = instituteRepository.save(institute);

        // Set user's institute
        Optional<User> optionalUser = userService.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setInstitute(institute);
            userService.save(user);
        }

        return institute;
    }

    @Transactional
    public User leaveInstitute(String username) {
        Optional<User> optionalUser = userService.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();
        Institute institute = user.getInstitute();
        if (institute != null) {
            institute.setStudentCount(Math.max(0, institute.getStudentCount() - 1));
            instituteRepository.save(institute);
        }
        user.setInstitute(null);
        return userService.save(user);
    }

    @Transactional
    public User setUserInstitute(String username, Long instituteId) {
        Optional<User> optionalUser = userService.findByUsername(username);
        Optional<Institute> optionalInstitute = instituteRepository.findById(instituteId);

        if (optionalUser.isEmpty() || optionalInstitute.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        Institute institute = optionalInstitute.get();

        user.setInstitute(institute);
        institute.setStudentCount(institute.getStudentCount() + 1);

        instituteRepository.save(institute);
        return userService.save(user);
    }
}
