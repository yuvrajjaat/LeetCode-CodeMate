package com.leetcodemate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDetailResponse {

    private Long id;
    private String username;
    private List<String> friends;
    private String githubUrl;
    private InstituteResponse institute;
    private List<LeetCodeUserProfile.QuestionCount> allQuestionsCount;
    private List<LeetCodeUserProfile.SubmissionCount> acSubmissionNum;
    private LeetCodeUserProfile.Profile profile;
    private LeetCodeUserProfile.ContestRanking userContestRanking;
    private List<LeetCodeUserProfile.RecentSubmission> recentAcSubmissionList;

    public UserDetailResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getFriends() {
        return friends;
    }

    public void setFriends(List<String> friends) {
        this.friends = friends;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public InstituteResponse getInstitute() {
        return institute;
    }

    public void setInstitute(InstituteResponse institute) {
        this.institute = institute;
    }

    public List<LeetCodeUserProfile.QuestionCount> getAllQuestionsCount() {
        return allQuestionsCount;
    }

    public void setAllQuestionsCount(List<LeetCodeUserProfile.QuestionCount> allQuestionsCount) {
        this.allQuestionsCount = allQuestionsCount;
    }

    public List<LeetCodeUserProfile.SubmissionCount> getAcSubmissionNum() {
        return acSubmissionNum;
    }

    public void setAcSubmissionNum(List<LeetCodeUserProfile.SubmissionCount> acSubmissionNum) {
        this.acSubmissionNum = acSubmissionNum;
    }

    public LeetCodeUserProfile.Profile getProfile() {
        return profile;
    }

    public void setProfile(LeetCodeUserProfile.Profile profile) {
        this.profile = profile;
    }

    public LeetCodeUserProfile.ContestRanking getUserContestRanking() {
        return userContestRanking;
    }

    public void setUserContestRanking(LeetCodeUserProfile.ContestRanking userContestRanking) {
        this.userContestRanking = userContestRanking;
    }

    public List<LeetCodeUserProfile.RecentSubmission> getRecentAcSubmissionList() {
        return recentAcSubmissionList;
    }

    public void setRecentAcSubmissionList(List<LeetCodeUserProfile.RecentSubmission> recentAcSubmissionList) {
        this.recentAcSubmissionList = recentAcSubmissionList;
    }

    // ----- Nested InstituteResponse -----

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InstituteResponse {
        private Long id;
        private String name;
        private String city;
        private String logo;
        private int studentCount;
        private List<String> students;

        public InstituteResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getLogo() {
            return logo;
        }

        public void setLogo(String logo) {
            this.logo = logo;
        }

        public int getStudentCount() {
            return studentCount;
        }

        public void setStudentCount(int studentCount) {
            this.studentCount = studentCount;
        }

        public List<String> getStudents() {
            return students;
        }

        public void setStudents(List<String> students) {
            this.students = students;
        }
    }
}
