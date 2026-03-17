package com.leetcodemate.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodemate.dto.LeetCodeUserProfile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LeetCodeApiService {

    private static final String LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

    private static final String USER_PROFILE_QUERY = "query getUserProfile($username: String!) {\n" +
            "    allQuestionsCount {\n" +
            "        difficulty\n" +
            "        count\n" +
            "    }\n" +
            "    matchedUser(username: $username) {\n" +
            "        username\n" +
            "        githubUrl\n" +
            "        profile {\n" +
            "            realName\n" +
            "            countryName\n" +
            "            starRating\n" +
            "            aboutMe\n" +
            "            userAvatar\n" +
            "            ranking\n" +
            "        }\n" +
            "        submitStats {\n" +
            "            acSubmissionNum {\n" +
            "                difficulty\n" +
            "                count\n" +
            "                submissions\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "    userContestRanking(username: $username) {\n" +
            "        attendedContestsCount\n" +
            "        rating\n" +
            "        topPercentage\n" +
            "    }\n" +
            "    recentAcSubmissionList(username: $username, limit: 11) {\n" +
            "        id\n" +
            "        title\n" +
            "        titleSlug\n" +
            "        timestamp\n" +
            "    }\n" +
            "}";

    private static final String USER_SKILL_STATS_QUERY = "query skillStats($username: String!) {\n" +
            "    matchedUser(username: $username) {\n" +
            "        tagProblemCounts {\n" +
            "            advanced {\n" +
            "                tagName\n" +
            "                tagSlug\n" +
            "                problemsSolved\n" +
            "            }\n" +
            "            intermediate {\n" +
            "                tagName\n" +
            "                tagSlug\n" +
            "                problemsSolved\n" +
            "            }\n" +
            "            fundamental {\n" +
            "                tagName\n" +
            "                tagSlug\n" +
            "                problemsSolved\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "}";

    private static final String UPCOMING_CONTESTS_QUERY = "query upcomingContests {\n" +
            "    upcomingContests {\n" +
            "        title\n" +
            "        titleSlug\n" +
            "        startTime\n" +
            "        duration\n" +
            "    }\n" +
            "}";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public LeetCodeApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public LeetCodeUserProfile fetchUserProfile(String username) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> variables = new HashMap<>();
            variables.put("username", username);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", USER_PROFILE_QUERY);
            requestBody.put("variables", variables);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    LEETCODE_GRAPHQL_URL, request, String.class);

            if (response.getBody() == null) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode dataNode = root.get("data");

            if (dataNode == null) {
                return null;
            }

            return objectMapper.treeToValue(dataNode, LeetCodeUserProfile.class);
        } catch (Exception e) {
            System.err.println("Error fetching LeetCode profile for " + username + ": " + e.getMessage());
            return null;
        }
    }

    public Map<String, Object> fetchUserSkillStats(String username) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> variables = new HashMap<>();
            variables.put("username", username);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", USER_SKILL_STATS_QUERY);
            requestBody.put("variables", variables);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    LEETCODE_GRAPHQL_URL, request, String.class);

            if (response.getBody() == null) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode dataNode = root.get("data");

            if (dataNode == null) {
                return null;
            }

            return objectMapper.convertValue(dataNode, Map.class);
        } catch (Exception e) {
            System.err.println("Error fetching skill stats for " + username + ": " + e.getMessage());
            return null;
        }
    }

    public List<Map<String, Object>> fetchUpcomingContests() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", UPCOMING_CONTESTS_QUERY);
            requestBody.put("variables", new HashMap<>());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    LEETCODE_GRAPHQL_URL, request, String.class);

            if (response.getBody() == null) {
                return new ArrayList<>();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode contestsNode = root.path("data").path("upcomingContests");

            if (contestsNode.isMissingNode() || !contestsNode.isArray()) {
                return new ArrayList<>();
            }

            List<Map<String, Object>> contests = new ArrayList<>();
            for (JsonNode contest : contestsNode) {
                Map<String, Object> c = objectMapper.convertValue(contest, Map.class);
                contests.add(c);
            }
            return contests;
        } catch (Exception e) {
            System.err.println("Error fetching upcoming contests: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
