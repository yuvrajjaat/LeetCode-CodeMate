import { useState, useEffect } from 'react';
import ProblemProgress from './ProblemProgress';
import { useUserContext } from '@/hooks/useUserContext';
import { useUrlContext } from '@/hooks/useUrlContext';
import { getUserDetail } from '@/api/api';
import clsx from 'clsx';
import { calcDate } from '@/utility/calcDate';
import Onboarding from './Onboarding';
import { MoonLoader } from 'react-spinners';
import { BsInfoCircle } from 'react-icons/bs';

const Profile = () => {
    const { url } = useUrlContext();
    const { user, dispatch } = useUserContext();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                dispatch({ type: "LOGIN", payload: request.greeting });
                chrome.storage.local.set({ 'user': request.greeting }).then(() => {
                    console.log("Value is set to " + request.greeting);
                });
                sendResponse(`found username ${request.greeting}`);
            }
        );
    }, []);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        getUserDetail(user)
            .then((result) => {
                setData(result);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return (
        <div className="flex flex-col justify-between items-center gap-6">
            <p className='text-lc-text-light text-lg'>Please Login to your LeetCode Account</p>
            <div className="flex justify-between p-2 items-center gap-4 w-[85%] rounded bg-lc-gray-1">
                <BsInfoCircle className='text-[8rem] m-2 text-lc-text-dark' />
                <p className='text-lc-text-dark text-sm p-2'>If you have logged into your LeetCode Account and still getting this page, then visit the LeetCode Homepage (leetcode.com) and reopen your LeetCode Profile and then open the extension</p>
            </div>
        </div>
    );

    if (loading) return <MoonLoader color="#ffa116" speedMultiplier={0.8} />;

    if (error) {
        return <Onboarding />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-w-[25rem]">
            <div className='flex flex-col justify-center items-start w-full py-4 px-8 bg-lc-gray-1 rounded-lg'>
                <div className="flex justify-center gap-4">
                    <img
                        src={data.profile.userAvatar}
                        width={100} height={100} alt="avatar" />
                    <div className="">
                        <h1 className='text-xl'>
                            {data.profile.realName}
                        </h1>
                        <p className='text-md text-lc-text-dark'>
                            {data.username}
                        </p>
                        <p className='text-md text-lc-text-dark'>
                            Rank: {data.profile.ranking}
                        </p>
                    </div>
                </div>
            </div>

            <div className='w-full p-4 bg-lc-gray-1 rounded-lg'>
                <p className='text-lc-text-dark text-sm'>Solved Problems</p>
                <div className="flex justify-center items-center gap-6 mt-4">

                    {/* circular progress bar  */}
                    <div className="shrink-1 relative max-h-[100px] max-w-[100px] z-base">
                        <svg className="h-full w-full origin-center -rotate-90 transform" viewBox="0 0 100 100">
                            <circle fill="none" cx="50px" cy="50px" r="46" strokeWidth="3" strokeLinecap="round" stroke="currentColor"
                                className="w-[100px] text-lc-gray-3"></circle>
                            <circle fill="none" cx="50px" cy="50px" r="46" strokeWidth="5" strokeLinecap="round" stroke="currentColor"
                                className="cursor-pointer text-lc-orange drop-shadow-[0_2px_4px_rgba(255,161,22,0.2)]" strokeDasharray="18.448501540229422 270.57802259003154" strokeDashoffset="0"></circle>
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-default text-center">
                            <div>
                                <div className="text-[24px] font-medium text-lc-text-light dark:text-dark-label-1">{data.acSubmissionNum[0].count}
                                </div>
                                <div className="whitespace-nowrap text-xs text-lc-text-dark dark:text-dark-label-3">Solved
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4 pb-4">
                        <ProblemProgress
                            difficulty='Easy'
                            color="green"
                            solvedQuestions={data.acSubmissionNum[1].count}
                            totalQuestions={data.allQuestionsCount[1].count}
                        />
                        <ProblemProgress
                            difficulty='Medium'
                            color="orange"
                            solvedQuestions={data.acSubmissionNum[2].count}
                            totalQuestions={data.allQuestionsCount[2].count}
                        />
                        <ProblemProgress
                            difficulty='Hard'
                            color="red"
                            solvedQuestions={data.acSubmissionNum[3].count}
                            totalQuestions={data.allQuestionsCount[3].count}
                        />
                    </div>
                </div>
            </div>

            <div className='w-full p-4 bg-lc-gray-1 rounded-lg'>
                <p className='text-lc-text-dark text-sm'>Contests</p>
                <div className="flex justify-around mt-4">
                    <div className="flex-col justify-start">
                        <p className='text-lc-text-dark text-xs'>Rating</p>
                        <p className='text-lc-text-light text-2xl'>{data.userContestRanking ? ~~data.userContestRanking.rating : 'N/A'}</p>
                    </div>
                    <div className="flex-col">
                        <p className='text-lc-text-dark text-xs'>Top</p>
                        <p className='text-lc-text-light text-2xl'>{data.userContestRanking ? `${data.userContestRanking.topPercentage}%` : 'N/A'}</p>
                    </div>
                    <div className="flex-col">
                        <p className='text-lc-text-dark text-xs'>Attended</p>
                        <p className='text-lc-text-light text-2xl'>{data.userContestRanking ? data.userContestRanking.attendedContestsCount : 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className='w-full flex-col justify-around p-4 bg-lc-gray-1 rounded-lg'>
                <div className="bg-lc-gray-3 flex justify-between items-center p-3 rounded-md w-[8rem] mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="currentColor"><path fillRule="evenodd" d="M20.995 4.824A3 3 0 0018 2H6l-.176.005A3 3 0 003 5v14l.005.176A3 3 0 006 22h12l.176-.005A3 3 0 0021 19V5l-.005-.176zM6 4h12l.117.007A1 1 0 0119 5v14l-.007.117A1 1 0 0118 20H6l-.117-.007A1 1 0 015 19V5l.007-.117A1 1 0 016 4zm5.718 9.304a1 1 0 01.063 1.321l-.085.093-2.062 2a1 1 0 01-1.3.08l-.093-.08-.937-.91A1 1 0 018.6 14.292l.095.082.241.234 1.367-1.325a1 1 0 011.414.022zM17 15a1 1 0 00-1-1h-2l-.117.007A1 1 0 0014 16h2l.117-.007A1 1 0 0017 15zm-5.282-7.696a1 1 0 01.063 1.321l-.085.093-2.062 2a1 1 0 01-1.3.08l-.093-.08-.937-.91A1 1 0 018.6 8.292l.095.082.241.234 1.367-1.325a1 1 0 011.414.022zM17 9a1 1 0 00-1-1h-2l-.117.007A1 1 0 0014 10h2l.117-.007A1 1 0 0017 9z" clipRule="evenodd"></path></svg>
                    <p> Recent AC </p>
                </div>

                <div className="flex-col gap-3">
                    {data.recentAcSubmissionList && data.recentAcSubmissionList.map((problem, index) => {
                        return (<button key={problem.id} className={clsx(" flex h-[3.5rem] justify-between items-center p-3 rounded-md w-full",
                            `${index % 2 == 0 && "bg-lc-gray-3"}`)}>
                            <p className='text-lc-text-light'>{problem.title}</p>
                            <p className='text-lc-text-dark'> {calcDate(problem.timestamp)}</p>
                        </button>);
                    })}
                </div>
            </div>
        </div>
    );
};

export default Profile;
