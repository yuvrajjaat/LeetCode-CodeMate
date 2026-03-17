import FriendItem from './FriendItem';
import { useUserContext } from '@/hooks/useUserContext';
import { getFriends, addFriend as addFriendApi, removeFriend as removeFriendApi } from '@/api/api';
import { TiUserAdd } from 'react-icons/ti';
import { useState, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
import { UserType } from '@/types/user';

const FriendList = () => {
    const [friendUsername, setFriendUsername] = useState('');
    const [sortBy, setSortBy] = useState("");
    const { user } = useUserContext();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);

    const fetchFriends = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getFriends(user);
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    if (!user) return <p>Please Login to your LeetCode Account</p>;

    if (loading) return <MoonLoader color="#ffa116" speedMultiplier={0.8} />;
    if (error) return <p>{error}</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !friendUsername) return;
        try {
            await addFriendApi(user, friendUsername);
            setFriendUsername('');
            fetchFriends();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleRemoveFriend = async (friendToRemove: string) => {
        if (!user) return;
        try {
            await removeFriendApi(user, friendToRemove);
            fetchFriends();
        } catch (err: any) {
            console.error(err);
        }
    };

    const sortList = (a: any, b: any) => {
        if (sortBy == "1")
            return b.acSubmissionNum[0].count - a.acSubmissionNum[0].count;
        else if (sortBy == "2")
            return b.userContestRanking.rating - a.userContestRanking.rating;
        else if (sortBy == "3")
            return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1;
        else if (sortBy == "4")
            return (b.codeMateScore || 0) - (a.codeMateScore || 0);
        else return 0;
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-w-[25rem]">

            <div className="flex justify-center gap-2  w-full">

                <form onSubmit={handleSubmit} className='w-[15rem] rounded-lg'>
                    <div className='w-full flex gap-2 justify-between items-center bg-lc-gray-3 rounded-lg'>
                        <input
                            className='border-lc-gray-2 focus:outline-none bg-lc-gray-3 p-3  text-lc-text-light rounded-lg w-full'
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                            placeholder='Friend Username'
                            type="text"
                            id="text"
                            name="text"
                            spellCheck="false"
                        />
                        <button
                            disabled={!friendUsername}
                            className="bg-lc-gray-3 p-1 flex justify-center items-center rounded transition-all">
                            <TiUserAdd className='text-xl text-lc-text-dark hover:scale-[1.1] transition-all hover:text-lc-text-light' />
                        </button>
                    </div>
                </form>
                <select
                    className="w-[7rem] p-3 border-lc-gray-2 bg-lc-gray-3 rounded-lg"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value) }}
                    name=""
                    id=""
                >
                    <option value="0">Sort by</option>
                    <option value="1">Questions</option>
                    <option value="2">Contest Rating</option>
                    <option value="3">Alphabetically</option>
                    <option value="4">CM Score</option>
                </select>
            </div>
            <div className="flex flex-col gap-2 w-full mt-4">
                {
                    ([] as any[]).concat(data)
                        .sort(sortList)
                        .map((friend: any) => {
                            return <FriendItem
                                key={friend.username}
                                username={friend.username}
                                realName={friend.profile.realName}
                                ranking={friend.profile.ranking}
                                acSubmissionNum={friend.acSubmissionNum}
                                allQuestionsCount={friend.allQuestionsCount}
                                userAvatar={friend.profile.userAvatar}
                                rating={friend.userContestRanking.rating}
                                codeMateScore={friend.codeMateScore}
                                onRemove={handleRemoveFriend}
                            />;
                        })}
            </div>
        </div>
    );
};

export default FriendList;
