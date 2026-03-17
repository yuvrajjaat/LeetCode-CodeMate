package com.leetcodemate.controller;

import com.leetcodemate.dto.LeetCodeUserProfile;
import com.leetcodemate.service.LeetCodeApiService;
import com.leetcodemate.service.UserService;
import com.leetcodemate.dto.UserDetailResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final LeetCodeApiService leetCodeApiService;
    private final UserService userService;

    public AnalyticsController(LeetCodeApiService leetCodeApiService, UserService userService) {
        this.leetCodeApiService = leetCodeApiService;
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getAnalytics(@PathVariable String username) {
        UserDetailResponse userDetail = userService.getUserDetail(username);
        if (userDetail == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> analytics = new HashMap<>();

        // 1. CodeMate Score calculation
        double codeMateScore = calculateCodeMateScore(userDetail);
        analytics.put("codeMateScore", Math.round(codeMateScore * 10.0) / 10.0);

        // 2. Difficulty distribution data (for pie/bar chart)
        Map<String, Object> difficultyData = new HashMap<>();
        if (userDetail.getAcSubmissionNum() != null && userDetail.getAcSubmissionNum().size() >= 4) {
            difficultyData.put("easy", userDetail.getAcSubmissionNum().get(1).getCount());
            difficultyData.put("medium", userDetail.getAcSubmissionNum().get(2).getCount());
            difficultyData.put("hard", userDetail.getAcSubmissionNum().get(3).getCount());
            difficultyData.put("total", userDetail.getAcSubmissionNum().get(0).getCount());
        }
        if (userDetail.getAllQuestionsCount() != null && userDetail.getAllQuestionsCount().size() >= 4) {
            difficultyData.put("totalEasy", userDetail.getAllQuestionsCount().get(1).getCount());
            difficultyData.put("totalMedium", userDetail.getAllQuestionsCount().get(2).getCount());
            difficultyData.put("totalHard", userDetail.getAllQuestionsCount().get(3).getCount());
            difficultyData.put("totalAll", userDetail.getAllQuestionsCount().get(0).getCount());
        }
        analytics.put("difficultyData", difficultyData);

        // 3. Difficulty balance score (how balanced is easy:medium:hard ratio)
        double balanceScore = calculateDifficultyBalance(userDetail);
        analytics.put("difficultyBalanceScore", Math.round(balanceScore * 10.0) / 10.0);
        analytics.put("difficultyBalanceLabel", getDifficultyBalanceLabel(balanceScore));

        // 4. Acceptance rate per difficulty
        Map<String, Object> acceptanceRates = new HashMap<>();
        if (userDetail.getAcSubmissionNum() != null) {
            for (LeetCodeUserProfile.SubmissionCount sc : userDetail.getAcSubmissionNum()) {
                if (sc.getSubmissions() > 0) {
                    double rate = ((double) sc.getCount() / sc.getSubmissions()) * 100;
                    acceptanceRates.put(sc.getDifficulty().toLowerCase(), Math.round(rate * 10.0) / 10.0);
                }
            }
        }
        analytics.put("acceptanceRates", acceptanceRates);

        // 5. Contest data
        Map<String, Object> contestData = new HashMap<>();
        if (userDetail.getUserContestRanking() != null) {
            contestData.put("rating", userDetail.getUserContestRanking().getRating());
            contestData.put("topPercentage", userDetail.getUserContestRanking().getTopPercentage());
            contestData.put("attended", userDetail.getUserContestRanking().getAttendedContestsCount());
        }
        analytics.put("contestData", contestData);

        // 6. Solving velocity (from recent submissions timestamps)
        if (userDetail.getRecentAcSubmissionList() != null && userDetail.getRecentAcSubmissionList().size() >= 2) {
            List<LeetCodeUserProfile.RecentSubmission> recent = userDetail.getRecentAcSubmissionList();
            long newest = Long.parseLong(recent.get(0).getTimestamp());
            long oldest = Long.parseLong(recent.get(recent.size() - 1).getTimestamp());
            long diffDays = Math.max(1, (newest - oldest) / (60 * 60 * 24));
            double velocity = (double) recent.size() / diffDays;
            analytics.put("solvingVelocity", Math.round(velocity * 100.0) / 100.0);

            // Estimated days to milestones
            if (velocity > 0 && userDetail.getAcSubmissionNum() != null && userDetail.getAcSubmissionNum().size() > 0) {
                int currentSolved = userDetail.getAcSubmissionNum().get(0).getCount();
                Map<String, Object> estimates = new HashMap<>();
                int[] targets = {100, 200, 300, 500, 750, 1000};
                for (int target : targets) {
                    if (currentSolved < target) {
                        int remaining = target - currentSolved;
                        int daysNeeded = (int) Math.ceil(remaining / velocity);
                        estimates.put(String.valueOf(target), daysNeeded);
                    }
                }
                analytics.put("estimatedDaysToTarget", estimates);
            }
        }

        // 7. Skill/Topic stats (weak topics analysis)
        Map<String, Object> skillStats = leetCodeApiService.fetchUserSkillStats(username);
        analytics.put("skillStats", skillStats);

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/contests")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingContests() {
        List<Map<String, Object>> contests = leetCodeApiService.fetchUpcomingContests();
        return ResponseEntity.ok(contests);
    }

    private double calculateCodeMateScore(UserDetailResponse user) {
        double score = 0;

        // Component 1: Problems Solved (max 30 points)
        // 500+ problems = full 30 points
        if (user.getAcSubmissionNum() != null && user.getAcSubmissionNum().size() > 0) {
            int totalSolved = user.getAcSubmissionNum().get(0).getCount();
            score += Math.min(30, (totalSolved / 500.0) * 30);
        }

        // Component 2: Difficulty Balance (max 25 points)
        // Ideal ratio: Easy 30%, Medium 50%, Hard 20%
        score += calculateDifficultyBalance(user) * 0.25;

        // Component 3: Contest Rating (max 25 points)
        // 2000+ rating = full 25 points
        if (user.getUserContestRanking() != null) {
            double rating = user.getUserContestRanking().getRating();
            score += Math.min(25, (rating / 2000.0) * 25);
        }

        // Component 4: Acceptance Rate (max 10 points)
        if (user.getAcSubmissionNum() != null) {
            int totalAccepted = 0;
            int totalSubmissions = 0;
            for (LeetCodeUserProfile.SubmissionCount sc : user.getAcSubmissionNum()) {
                if (!sc.getDifficulty().equals("All")) {
                    totalAccepted += sc.getCount();
                    totalSubmissions += sc.getSubmissions();
                }
            }
            if (totalSubmissions > 0) {
                double acceptanceRate = (double) totalAccepted / totalSubmissions;
                score += acceptanceRate * 10;
            }
        }

        // Component 5: Consistency (max 10 points) - based on recent submission spread
        if (user.getRecentAcSubmissionList() != null && user.getRecentAcSubmissionList().size() >= 2) {
            List<LeetCodeUserProfile.RecentSubmission> recent = user.getRecentAcSubmissionList();
            long newest = Long.parseLong(recent.get(0).getTimestamp());
            long oldest = Long.parseLong(recent.get(recent.size() - 1).getTimestamp());
            long diffDays = Math.max(1, (newest - oldest) / (60 * 60 * 24));
            // If 11 problems in <= 11 days, high consistency
            double consistencyRatio = Math.min(1.0, (double) recent.size() / Math.max(diffDays, 1));
            score += consistencyRatio * 10;
        }

        return Math.min(100, score);
    }

    private double calculateDifficultyBalance(UserDetailResponse user) {
        if (user.getAcSubmissionNum() == null || user.getAcSubmissionNum().size() < 4) {
            return 0;
        }
        int easy = user.getAcSubmissionNum().get(1).getCount();
        int medium = user.getAcSubmissionNum().get(2).getCount();
        int hard = user.getAcSubmissionNum().get(3).getCount();
        int total = easy + medium + hard;

        if (total == 0) return 0;

        // Ideal ratios: Easy 30%, Medium 50%, Hard 20%
        double easyRatio = (double) easy / total;
        double mediumRatio = (double) medium / total;
        double hardRatio = (double) hard / total;

        // Calculate deviation from ideal
        double easyDev = Math.abs(easyRatio - 0.30);
        double mediumDev = Math.abs(mediumRatio - 0.50);
        double hardDev = Math.abs(hardRatio - 0.20);

        // Lower deviation = higher score (max 100)
        double totalDev = easyDev + mediumDev + hardDev;
        return Math.max(0, 100 - (totalDev * 100));
    }

    private String getDifficultyBalanceLabel(double score) {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        if (score >= 20) return "Needs Improvement";
        return "Imbalanced";
    }
}
