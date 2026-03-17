package com.leetcodemate.service;

import com.leetcodemate.dto.FriendDetailResponse;
import com.leetcodemate.dto.LeetCodeUserProfile;
import com.leetcodemate.dto.UserDetailResponse;
import com.leetcodemate.model.Institute;
import com.leetcodemate.model.User;
import com.leetcodemate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LeetCodeApiService leetCodeApiService;

    public UserService(UserRepository userRepository, LeetCodeApiService leetCodeApiService) {
        this.userRepository = userRepository;
        this.leetCodeApiService = leetCodeApiService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public User createUser(String username) {
        User user = new User(username);
        return userRepository.save(user);
    }

    public UserDetailResponse getUserDetail(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        LeetCodeUserProfile leetCodeProfile = leetCodeApiService.fetchUserProfile(username);

        UserDetailResponse response = new UserDetailResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFriends(user.getFriends());

        // Resolve institute
        if (user.getInstitute() != null) {
            Institute inst = user.getInstitute();
            UserDetailResponse.InstituteResponse instResponse = new UserDetailResponse.InstituteResponse();
            instResponse.setId(inst.getId());
            instResponse.setName(inst.getName());
            instResponse.setCity(inst.getCity());
            instResponse.setLogo(inst.getLogo());
            instResponse.setStudentCount(inst.getStudentCount());

            // Derive students list from users with this institute
            List<User> students = userRepository.findByInstituteId(inst.getId());
            List<String> studentUsernames = students.stream()
                    .map(User::getUsername)
                    .collect(Collectors.toList());
            instResponse.setStudents(studentUsernames);

            response.setInstitute(instResponse);
        }

        // Populate LeetCode data
        if (leetCodeProfile != null) {
            response.setAllQuestionsCount(leetCodeProfile.getAllQuestionsCount());
            response.setRecentAcSubmissionList(leetCodeProfile.getRecentAcSubmissionList());
            response.setUserContestRanking(leetCodeProfile.getUserContestRanking());

            if (leetCodeProfile.getMatchedUser() != null) {
                response.setGithubUrl(leetCodeProfile.getMatchedUser().getGithubUrl());
                response.setProfile(leetCodeProfile.getMatchedUser().getProfile());

                if (leetCodeProfile.getMatchedUser().getSubmitStats() != null) {
                    response.setAcSubmissionNum(leetCodeProfile.getMatchedUser().getSubmitStats().getAcSubmissionNum());
                }
            }
        }

        return response;
    }

    @Transactional
    public User removeFriend(String userUsername, String friendUsername) {
        Optional<User> optionalUser = userRepository.findByUsername(userUsername);
        if (optionalUser.isEmpty()) {
            return null;
        }
        User user = optionalUser.get();
        user.getFriends().remove(friendUsername);
        return userRepository.save(user);
    }

    @Transactional
    public User addFriend(String userUsername, String friendUsername) {
        Optional<User> optionalUser = userRepository.findByUsername(userUsername);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        if (!user.getFriends().contains(friendUsername)) {
            user.getFriends().add(friendUsername);
            userRepository.save(user);
        }
        return user;
    }

    public List<FriendDetailResponse> getFriendsWithProfiles(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return new ArrayList<>();
        }

        User user = optionalUser.get();
        List<FriendDetailResponse> friendProfiles = new ArrayList<>();

        for (String friendUsername : user.getFriends()) {
            FriendDetailResponse friendDetail = buildFriendDetail(friendUsername);
            if (friendDetail != null) {
                friendProfiles.add(friendDetail);
            }
        }

        return friendProfiles;
    }

    public FriendDetailResponse buildFriendDetail(String username) {
        LeetCodeUserProfile leetCodeProfile = leetCodeApiService.fetchUserProfile(username);
        if (leetCodeProfile == null) {
            return null;
        }

        FriendDetailResponse response = new FriendDetailResponse();
        response.setUsername(username);
        response.setAllQuestionsCount(leetCodeProfile.getAllQuestionsCount());
        response.setRecentAcSubmissionList(leetCodeProfile.getRecentAcSubmissionList());
        response.setUserContestRanking(leetCodeProfile.getUserContestRanking());

        if (leetCodeProfile.getMatchedUser() != null) {
            response.setGithubUrl(leetCodeProfile.getMatchedUser().getGithubUrl());
            response.setProfile(leetCodeProfile.getMatchedUser().getProfile());

            if (leetCodeProfile.getMatchedUser().getSubmitStats() != null) {
                response.setAcSubmissionNum(leetCodeProfile.getMatchedUser().getSubmitStats().getAcSubmissionNum());
            }
        }

        response.setCodeMateScore(Math.round(calculateCodeMateScore(response) * 10.0) / 10.0);

        return response;
    }

    private double calculateCodeMateScore(FriendDetailResponse user) {
        double score = 0;

        if (user.getAcSubmissionNum() != null && user.getAcSubmissionNum().size() > 0) {
            int totalSolved = user.getAcSubmissionNum().get(0).getCount();
            score += Math.min(30, (totalSolved / 500.0) * 30);
        }

        if (user.getAcSubmissionNum() != null && user.getAcSubmissionNum().size() >= 4) {
            int easy = user.getAcSubmissionNum().get(1).getCount();
            int medium = user.getAcSubmissionNum().get(2).getCount();
            int hard = user.getAcSubmissionNum().get(3).getCount();
            int total = easy + medium + hard;
            if (total > 0) {
                double easyDev = Math.abs((double) easy / total - 0.30);
                double mediumDev = Math.abs((double) medium / total - 0.50);
                double hardDev = Math.abs((double) hard / total - 0.20);
                score += Math.max(0, (100 - (easyDev + mediumDev + hardDev) * 100)) * 0.25;
            }
        }

        if (user.getUserContestRanking() != null) {
            score += Math.min(25, (user.getUserContestRanking().getRating() / 2000.0) * 25);
        }

        if (user.getAcSubmissionNum() != null) {
            int totalAccepted = 0, totalSubmissions = 0;
            for (LeetCodeUserProfile.SubmissionCount sc : user.getAcSubmissionNum()) {
                if (!sc.getDifficulty().equals("All")) {
                    totalAccepted += sc.getCount();
                    totalSubmissions += sc.getSubmissions();
                }
            }
            if (totalSubmissions > 0) {
                score += ((double) totalAccepted / totalSubmissions) * 10;
            }
        }

        if (user.getRecentAcSubmissionList() != null && user.getRecentAcSubmissionList().size() >= 2) {
            var recent = user.getRecentAcSubmissionList();
            long newest = Long.parseLong(recent.get(0).getTimestamp());
            long oldest = Long.parseLong(recent.get(recent.size() - 1).getTimestamp());
            long diffDays = Math.max(1, (newest - oldest) / (60 * 60 * 24));
            score += Math.min(1.0, (double) recent.size() / Math.max(diffDays, 1)) * 10;
        }

        return Math.min(100, score);
    }

    public List<User> findByInstituteId(Long instituteId) {
        return userRepository.findByInstituteId(instituteId);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }
}
