import { useUserContext } from '@/hooks/useUserContext';
import { createUser } from '@/api/api';
import { useState } from 'react';

const Onboarding = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useUserContext();

    const handleClick = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await createUser(user);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div>
            <p>Welcome to LeetCode CodeMate.</p>
            <button onClick={handleClick} disabled={loading}
                className='m-2 p-2 bg-lc-gray-3'>{loading && "Loading ... "} {!loading && "Get Started"}</button>
        </div>
    );
};

export default Onboarding;
