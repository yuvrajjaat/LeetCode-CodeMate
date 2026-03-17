package com.leetcodemate.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FriendDetailResponse {

    private String username;
    private String githubUrl;
    private List<LeetCodeUserProfile.QuestionCount> allQuestionsCount;
    private List<LeetCodeUserProfile.SubmissionCount> acSubmissionNum;
    private LeetCodeUserProfile.Profile profile;
    private LeetCodeUserProfile.ContestRanking userContestRanking;
    private List<LeetCodeUserProfile.RecentSubmission> recentAcSubmissionList;
    private double codeMateScore;

    public FriendDetailResponse() {
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

    public double getCodeMateScore() {
        return codeMateScore;
    }

    public void setCodeMateScore(double codeMateScore) {
        this.codeMateScore = codeMateScore;
    }
}
