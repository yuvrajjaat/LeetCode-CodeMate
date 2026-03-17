import { useState, useEffect } from 'react';
import { MdOutlineSchool } from 'react-icons/md';
import { SlLocationPin } from 'react-icons/sl';
import { BsBuildingFillAdd } from 'react-icons/bs';
import { HiBuildingLibrary } from 'react-icons/hi2';
import { FaUserGraduate } from 'react-icons/fa';
import { getInstitutes, setInstitute as setInstituteApi } from '@/api/api';
import { useUserContext } from '@/hooks/useUserContext';
import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

type DataType = {
    id: number,
    name: string,
    city: string,
    logo?: string,
    student_count?: number,
}

type InstituteFormProps = {
    onInstituteSet?: () => void;
}

const InstituteForm = ({ onInstituteSet }: InstituteFormProps) => {
    const { user } = useUserContext();

    const [value, setValue] = useState('');
    const [instituteId, setInstituteId] = useState(0);
    const [notFound, setNotFound] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [institutes, setInstitutes] = useState<DataType[]>([]);

    useEffect(() => {
        setLoading(true);
        getInstitutes()
            .then((result) => setInstitutes(result))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleClick = (institute: DataType) => {
        setValue(institute.name);
        setInstituteId(institute.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (instituteId === 0) {
            console.log('please choose your institute');
        } else {
            if (!user) return;
            console.log('added ', instituteId, " ", value);
            try {
                await setInstituteApi(user, instituteId);
                onInstituteSet?.();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <MoonLoader color="#ffa116" speedMultiplier={0.8} />;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex mt-6 justify-center gap-2 w-full">
            <form onSubmit={handleSubmit} className='w-[25rem] rounded-lg'>
                <div className='w-full flex gap-2 justify-between items-center bg-lc-gray-3 rounded-lg'>
                    <input
                        className='border-lc-gray-2 focus:outline-none bg-lc-gray-3 p-3  text-lc-text-light rounded-lg w-full'
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setNotFound(true) }}
                        placeholder='Select your Institute'
                        type="text"
                        id="list"
                        name="list"
                        autoComplete='off'
                    />

                    <button
                        className="bg-lc-gray-3 p-1 mr-3 flex justify-center items-center rounded transition-all">
                        <MdOutlineSchool className='text-xl text-lc-text-dark hover:scale-[1.1] transition-all hover:text-lc-text-light' />
                    </button>
                </div>
                <div className="flex flex-col gap-1 mt-2 rounded">
                    {value &&
                        <div className='bg-lc-gray-1 p-2 rounded flex justify-between gap-2 items-center'>
                            <div className="flex justify-start gap-2 items-center">
                                <HiBuildingLibrary className='text-7xl p-2 text-lc-text-dark' />
                                <div className="flex flex-col gap-1 items-start justify-center w-full">
                                    <p className='text-lg w-[16rem]'>Can&apos;t find your College?</p>
                                </div>
                            </div>
                            <Link to="/new-institute" className="flex justify-center items-center gap-1 bg-lc-gray-3 p-2 rounded hover:bg-lc-gray-2 transition-all -translate-x-9">
                                <BsBuildingFillAdd className='text-md text-lc-text-dark' />
                                <p className='text-lg text-lc-text-dark'> Add</p>
                            </Link>
                        </div>
                    }
                    {institutes
                        .filter((institute: any) => {
                            const searchTerm = value.toLowerCase();
                            const inst = institute.name.toLowerCase();
                            if (searchTerm && inst !== searchTerm) {
                                return inst.startsWith(searchTerm);
                            }
                        })
                        .slice(0, 10)
                        .map((institute: any) =>
                            <div className='bg-lc-gray-1 p-2 rounded flex justify-between gap-2 items-center' key={institute.id} onClick={() => handleClick(institute)}>
                                <div className="flex justify-start gap-2 items-center">
                                    <div className="">
                                        {institute.logo ?
                                            <img src={institute.logo} alt="logo" width={110} height={110} />
                                            :
                                            <HiBuildingLibrary className='text-lc-text-dark text-6xl' />
                                        }
                                    </div>
                                    <div className="flex flex-col gap-1 items-start justify-center w-full">
                                        <p className='text-lg w-[16rem]'>{institute.name}</p>
                                        <div className="flex justify-start gap-1 items-center">
                                            <SlLocationPin className='text-xs' />
                                            <p className='text-xs'>Location: {institute.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-1">
                                    <FaUserGraduate className='text-md text-lc-text-dark' />
                                    <p className='text-lg text-lc-text-dark' >{institute.student_count}</p>
                                </div>
                            </div>
                        )}
                </div>
            </form>
        </div>
    );
};

export default InstituteForm;
