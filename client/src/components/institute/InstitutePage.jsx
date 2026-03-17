import { useUserContext } from '@/hooks/useUserContext';
import { useState, useEffect } from 'react';
import { MdOutlineSchool } from 'react-icons/md';
import InstituteForm from './InstituteForm';
import { getUserDetail, leaveInstitute } from '@/api/api';
import InstituteDetail from './InstituteDetail';
import BatchmatesList from './BatchmatesList';
import { MoonLoader } from 'react-spinners';

const InstitutePage = () => {
    const { user } = useUserContext();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getUserDetail(user);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleLeaveInstitute = async () => {
        if (!user) return;
        try {
            await leaveInstitute(user);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex mt-2 justify-center w-full">
        <MoonLoader color="#ffa116" speedMultiplier={0.8} />
    </div>;
    if (error) return <p>{error}</p>;

    if (!data?.institute) {
        return (
            <div className="flex flex-col justify-center items-center px-4 py-2 w-full h-full bg-lc-gray-2 text-white">
                <div className='flex flex-col justify-center items-center w-full py-4 px-8'>
                    <MdOutlineSchool className='text-4xl text-lc-text-dark' />
                    <p className='text-lc-text-dark'> Add your Institute </p>
                    <InstituteForm onInstituteSet={fetchData} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center px-4 py-2 w-full h-full bg-lc-gray-2 text-white">
            <div className='flex flex-col items-center w-full py-4 px-8 bg-lc-gray-1 rounded-lg'>
                <InstituteDetail userData={data} onLeave={handleLeaveInstitute} />
            </div>
            <BatchmatesList />
        </div>
    );
};

export default InstitutePage;
