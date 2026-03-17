import { HiBuildingLibrary } from 'react-icons/hi2';
import { SlLocationPin } from 'react-icons/sl';
import { FaUserGraduate } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { IoExitOutline } from 'react-icons/io5';

const InstituteDetail = ({ userData, onLeave }) => {
    if (!userData?.institute) return null;

    return (
        <div className='w-[25rem]'>
            <div className="flex gap-4 items-center">
                <div className="">
                    {userData.institute.logo ?
                        <img src={userData.institute.logo} alt="logo" width={110} height={110} />
                        :
                        <HiBuildingLibrary className='text-lc-text-dark text-6xl' />
                    }
                </div>
                <div className="flex flex-col items-start">
                    <div className="flex justify-center items-center gap-1">
                        <BsInfoCircle className='text-xs' />
                        <p className='text-xs text-lc-text-dark'>About Institute</p>
                    </div>
                    <p className='text-xl mt-2'>{userData.institute.name}</p>
                    <div className="flex justify-between w-full mt-1 gap-6">
                        <div className="flex justify-center gap-1 items-center">
                            <div className="flex justify-center gap-1 items-center">
                                <SlLocationPin className='text-sm text-lc-text-dark' />
                                <p className='text-sm text-lc-text-dark'>Location: </p>
                            </div>
                            <p className='text-sm'>{userData.institute.city}</p>
                        </div>
                        <div className="flex justify-center gap-1">
                            <div className="flex justify-center gap-1 items-center">
                                <FaUserGraduate className='text-sm text-lc-text-dark' />
                                <p className='text-sm text-lc-text-dark'>Students: </p>
                            </div>
                            <p className='text-sm'>{userData.institute.studentCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            {onLeave && (
                <button
                    onClick={onLeave}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-lc-gray-3 hover:bg-lc-red-alt text-lc-text-dark hover:text-lc-red p-2 rounded-lg transition-all"
                >
                    <IoExitOutline className="text-lg" />
                    <span className="text-sm">Leave Institute</span>
                </button>
            )}
        </div>
    );
};

export default InstituteDetail;
