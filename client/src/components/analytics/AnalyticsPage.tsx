import { useUserContext } from '@/hooks/useUserContext';
import { useState, useEffect } from 'react';
import { getAnalytics, getUpcomingContests } from '@/api/api';
import { MoonLoader } from 'react-spinners';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IoTrophy, IoTimer, IoFlame, IoSpeedometer } from 'react-icons/io5';
import { BsGraphUp, BsLightningCharge } from 'react-icons/bs';

const COLORS = {
    easy: '#00b8a3',
    medium: '#ffa116',
    hard: '#ef4743',
};

const AnalyticsPage = () => {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [contests, setContests] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all([
            getAnalytics(user),
            getUpcomingContests()
        ])
            .then(([analyticsData, contestsData]) => {
                setAnalytics(analyticsData);
                setContests(contestsData || []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return <p className="text-lc-text-light">Please Login to your LeetCode Account</p>;
    if (loading) return <MoonLoader color="#ffa116" speedMultiplier={0.8} />;
    if (error) return <p className="text-lc-red">{error}</p>;
    if (!analytics) return null;

    const diffData = analytics.difficultyData || {};
    const pieData = [
        { name: 'Easy', value: diffData.easy || 0, color: COLORS.easy },
        { name: 'Medium', value: diffData.medium || 0, color: COLORS.medium },
        { name: 'Hard', value: diffData.hard || 0, color: COLORS.hard },
    ];

    const barData = [
        { name: 'Easy', solved: diffData.easy || 0, total: diffData.totalEasy || 0 },
        { name: 'Medium', solved: diffData.medium || 0, total: diffData.totalMedium || 0 },
        { name: 'Hard', solved: diffData.hard || 0, total: diffData.totalHard || 0 },
    ];

    // Process skill stats for weak topics
    const skillStats = analytics.skillStats?.matchedUser?.tagProblemCounts;
    const allTopics: { tagName: string; problemsSolved: number; level: string }[] = [];
    if (skillStats) {
        ['fundamental', 'intermediate', 'advanced'].forEach((level) => {
            if (skillStats[level]) {
                skillStats[level].forEach((t: any) => {
                    allTopics.push({ ...t, level });
                });
            }
        });
    }
    // Sort by problems solved ascending to find weak topics
    const weakTopics = [...allTopics].sort((a, b) => a.problemsSolved - b.problemsSolved).slice(0, 8);
    const strongTopics = [...allTopics].sort((a, b) => b.problemsSolved - a.problemsSolved).slice(0, 5);

    // Format contest countdown
    const formatCountdown = (startTime: number) => {
        const now = Math.floor(Date.now() / 1000);
        const diff = startTime - now;
        if (diff <= 0) return 'Started';
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    const formatContestDate = (startTime: number) => {
        return new Date(startTime * 1000).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'text-lc-green';
        if (score >= 50) return 'text-lc-orange';
        return 'text-lc-red';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 75) return 'from-lc-green-alt to-lc-green';
        if (score >= 50) return 'from-lc-orange-alt to-lc-orange';
        return 'from-lc-red-alt to-lc-red';
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-w-[25rem] px-4 py-2">

            {/* CodeMate Score */}
            <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                    <IoTrophy className="text-lc-orange text-xl" />
                    <p className="text-lc-text-dark text-sm font-medium">CodeMate Score</p>
                </div>
                <div className="flex items-center justify-center gap-6">
                    <div className="relative">
                        <svg className="h-[120px] w-[120px] origin-center -rotate-90 transform" viewBox="0 0 100 100">
                            <circle fill="none" cx="50" cy="50" r="42" strokeWidth="6" stroke="#3e3e3e" />
                            <circle fill="none" cx="50" cy="50" r="42" strokeWidth="6" strokeLinecap="round"
                                className={getScoreColor(analytics.codeMateScore)}
                                stroke="currentColor"
                                strokeDasharray={`${(analytics.codeMateScore / 100) * 264} ${264 - (analytics.codeMateScore / 100) * 264}`}
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className={`text-3xl font-bold ${getScoreColor(analytics.codeMateScore)}`}>
                                {analytics.codeMateScore}
                            </p>
                            <p className="text-xs text-lc-text-dark">/100</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between gap-4" title="How well-distributed your solved problems are across Easy, Medium, and Hard. Ideal ratio: 30% Easy, 50% Medium, 20% Hard.">
                            <span className="text-lc-text-dark cursor-help border-b border-dotted border-lc-text-dark">Difficulty Balance:</span>
                            <span className="text-lc-text-light">{analytics.difficultyBalanceLabel}</span>
                        </div>
                        <div className="flex justify-between gap-4" title="How many problems you solve per day, calculated from your recent 11 accepted submissions.">
                            <span className="text-lc-text-dark cursor-help border-b border-dotted border-lc-text-dark">Solving Speed:</span>
                            <span className="text-lc-text-light">{analytics.solvingVelocity || 0} problems/day</span>
                        </div>
                        {analytics.contestData?.rating && (
                            <div className="flex justify-between gap-4" title="Your LeetCode contest rating based on contest performance.">
                                <span className="text-lc-text-dark cursor-help border-b border-dotted border-lc-text-dark">Rating:</span>
                                <span className="text-lc-text-light">{~~analytics.contestData.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Difficulty Distribution Chart */}
            <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <BsGraphUp className="text-lc-orange text-lg" />
                    <p className="text-lc-text-dark text-sm font-medium">Difficulty Distribution</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={60}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-lc-text-dark">{item.name}:</span>
                                <span className="text-sm text-lc-text-light font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar chart: solved vs total */}
                <div className="mt-4">
                    <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={barData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={55} tick={{ fill: '#bdbfc2', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#282828', border: 'none', borderRadius: '8px', color: '#fff' }}
                                formatter={(value: number, name: string) => [value, name === 'solved' ? 'Solved' : 'Total']}
                            />
                            <Bar dataKey="total" fill="#3e3e3e" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="solved" fill="#ffa116" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Estimated Days to Target */}
            {analytics.estimatedDaysToTarget && Object.keys(analytics.estimatedDaysToTarget).length > 0 && (
                <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <IoSpeedometer className="text-lc-orange text-lg" />
                        <p className="text-lc-text-dark text-sm font-medium">Estimated Days to Target</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(analytics.estimatedDaysToTarget).map(([target, days]: [string, any]) => (
                            <div key={target} className="bg-lc-gray-3 rounded-lg p-3 text-center">
                                <p className="text-lg font-medium text-lc-text-light">{days}d</p>
                                <p className="text-xs text-lc-text-dark">to {target}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Weak Topics Analysis */}
            {weakTopics.length > 0 && (
                <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <BsLightningCharge className="text-lc-red text-lg" />
                        <p className="text-lc-text-dark text-sm font-medium">Weak Topics (Need Practice)</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {weakTopics.map((topic) => (
                            <div key={topic.tagName} className="flex justify-between items-center bg-lc-gray-3 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        topic.level === 'fundamental' ? 'bg-lc-green-alt text-lc-green' :
                                        topic.level === 'intermediate' ? 'bg-lc-orange-alt text-lc-orange' :
                                        'bg-lc-red-alt text-lc-red'
                                    }`}>{topic.level[0].toUpperCase()}</span>
                                    <span className="text-sm text-lc-text-light">{topic.tagName}</span>
                                </div>
                                <span className="text-sm text-lc-text-dark">{topic.problemsSolved} solved</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strong Topics */}
            {strongTopics.length > 0 && (
                <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <IoFlame className="text-lc-green text-lg" />
                        <p className="text-lc-text-dark text-sm font-medium">Strong Topics</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {strongTopics.map((topic) => (
                            <div key={topic.tagName} className="flex items-center gap-1 bg-lc-green-alt text-lc-green rounded-full px-3 py-1">
                                <span className="text-xs">{topic.tagName}</span>
                                <span className="text-xs font-bold">{topic.problemsSolved}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Acceptance Rates */}
            {analytics.acceptanceRates && Object.keys(analytics.acceptanceRates).length > 0 && (
                <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <IoTrophy className="text-lc-orange text-lg" />
                        <p className="text-lc-text-dark text-sm font-medium">Acceptance Rates</p>
                    </div>
                    <div className="flex justify-around">
                        {['easy', 'medium', 'hard'].map((diff) => {
                            const rate = analytics.acceptanceRates[diff];
                            if (rate === undefined) return null;
                            const color = diff === 'easy' ? 'text-lc-green' : diff === 'medium' ? 'text-lc-orange' : 'text-lc-red';
                            return (
                                <div key={diff} className="text-center">
                                    <p className="text-lc-text-dark text-xs capitalize">{diff}</p>
                                    <p className={`text-xl font-medium ${color}`}>{rate}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Upcoming Contests */}
            <div className="w-full p-5 bg-lc-gray-1 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <IoTimer className="text-lc-orange text-lg" />
                    <p className="text-lc-text-dark text-sm font-medium">Upcoming Contests</p>
                </div>
                {contests.length === 0 ? (
                    <p className="text-lc-text-dark text-sm">No upcoming contests found</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {contests.map((contest: any) => (
                            <div key={contest.titleSlug} className="flex justify-between items-center bg-lc-gray-3 rounded-lg px-3 py-3">
                                <div className="flex flex-col">
                                    <p className="text-sm text-lc-text-light">{contest.title}</p>
                                    <p className="text-xs text-lc-text-dark">{formatContestDate(contest.startTime)}</p>
                                </div>
                                <div className="bg-lc-orange-alt text-lc-orange px-2 py-1 rounded text-xs font-medium">
                                    {formatCountdown(contest.startTime)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
