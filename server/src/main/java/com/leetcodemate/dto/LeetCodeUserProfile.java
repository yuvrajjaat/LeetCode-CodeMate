package com.leetcodemate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LeetCodeUserProfile {

    private List<QuestionCount> allQuestionsCount;
    private MatchedUser matchedUser;
    private ContestRanking userContestRanking;
    private List<RecentSubmission> recentAcSubmissionList;

    public LeetCodeUserProfile() {
    }

    public List<QuestionCount> getAllQuestionsCount() {
        return allQuestionsCount;
    }

    public void setAllQuestionsCount(List<QuestionCount> allQuestionsCount) {
        this.allQuestionsCount = allQuestionsCount;
    }

    public MatchedUser getMatchedUser() {
        return matchedUser;
    }

    public void setMatchedUser(MatchedUser matchedUser) {
        this.matchedUser = matchedUser;
    }

    public ContestRanking getUserContestRanking() {
        return userContestRanking;
    }

    public void setUserContestRanking(ContestRanking userContestRanking) {
        this.userContestRanking = userContestRanking;
    }

    public List<RecentSubmission> getRecentAcSubmissionList() {
        return recentAcSubmissionList;
    }

    public void setRecentAcSubmissionList(List<RecentSubmission> recentAcSubmissionList) {
        this.recentAcSubmissionList = recentAcSubmissionList;
    }

    // ----- Nested DTOs -----

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuestionCount {
        private String difficulty;
        private int count;

        public QuestionCount() {
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MatchedUser {
        private String username;
        private String githubUrl;
        private Profile profile;
        private SubmitStats submitStats;

        public MatchedUser() {
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getGithubUrl() {
            return githubUrl;
        }

        public void setGithubUrl(String githubUrl) {
            this.githubUrl = githubUrl;
        }

        public Profile getProfile() {
            return profile;
        }

        public void setProfile(Profile profile) {
            this.profile = profile;
        }

        public SubmitStats getSubmitStats() {
            return submitStats;
        }

        public void setSubmitStats(SubmitStats submitStats) {
            this.submitStats = submitStats;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Profile {
        private String realName;
        private String countryName;
        private double starRating;
        private String aboutMe;
        private String userAvatar;
        private int ranking;

        public Profile() {
        }

        public String getRealName() {
            return realName;
        }

        public void setRealName(String realName) {
            this.realName = realName;
        }

        public String getCountryName() {
            return countryName;
        }

        public void setCountryName(String countryName) {
            this.countryName = countryName;
        }

        public double getStarRating() {
            return starRating;
        }

        public void setStarRating(double starRating) {
            this.starRating = starRating;
        }

        public String getAboutMe() {
            return aboutMe;
        }

        public void setAboutMe(String aboutMe) {
            this.aboutMe = aboutMe;
        }

        public String getUserAvatar() {
            return userAvatar;
        }

        public void setUserAvatar(String userAvatar) {
            this.userAvatar = userAvatar;
        }

        public int getRanking() {
            return ranking;
        }

        public void setRanking(int ranking) {
            this.ranking = ranking;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SubmitStats {
        private List<SubmissionCount> acSubmissionNum;

        public SubmitStats() {
        }

        public List<SubmissionCount> getAcSubmissionNum() {
            return acSubmissionNum;
        }

        public void setAcSubmissionNum(List<SubmissionCount> acSubmissionNum) {
            this.acSubmissionNum = acSubmissionNum;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SubmissionCount {
        private String difficulty;
        private int count;
        private int submissions;

        public SubmissionCount() {
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public int getSubmissions() {
            return submissions;
        }

        public void setSubmissions(int submissions) {
            this.submissions = submissions;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ContestRanking {
        private int attendedContestsCount;
        private double rating;
        private double topPercentage;

        public ContestRanking() {
        }

        public int getAttendedContestsCount() {
            return attendedContestsCount;
        }

        public void setAttendedContestsCount(int attendedContestsCount) {
            this.attendedContestsCount = attendedContestsCount;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
        }

        public double getTopPercentage() {
            return topPercentage;
        }

        public void setTopPercentage(double topPercentage) {
            this.topPercentage = topPercentage;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RecentSubmission {
        private String id;
        private String title;
        private String titleSlug;
        private String timestamp;

        public RecentSubmission() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getTitleSlug() {
            return titleSlug;
        }

        public void setTitleSlug(String titleSlug) {
            this.titleSlug = titleSlug;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }
    }
}
