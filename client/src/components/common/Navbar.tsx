import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { FaUserFriends } from 'react-icons/fa';
import { IoSchool } from 'react-icons/io5';
import { BsGraphUp } from 'react-icons/bs';

const Navbar = () => {
    return (
        <div className='flex items-center justify-around gap-1 bg-lc-gray-2 text-lc-text-dark w-full fixed bottom-0 z-[500]'>
            <Link className='w-full' to="/">
                <div className="flex flex-col gap-1 bg-lc-gray-1 items-center justify-center w-full p-2 rounded">
                    <CgProfile />
                    <p className='text-[0.65rem]'>Profile</p>
                </div>
            </Link>
            <Link className='w-full' to="/friends">
                <div className="flex flex-col gap-1 bg-lc-gray-1 items-center justify-center w-full p-2 rounded">
                    <FaUserFriends />
                    <p className='text-[0.65rem]'>Friends</p>
                </div>
            </Link>
            <Link className='w-full' to="/institute">
                <div className="flex flex-col gap-1 bg-lc-gray-1 items-center justify-center w-full p-2 rounded">
                    <IoSchool />
                    <p className='text-[0.65rem]'>Institute</p>
                </div>
            </Link>
            <Link className='w-full' to="/analytics">
                <div className="flex flex-col gap-1 bg-lc-gray-1 items-center justify-center w-full p-2 rounded">
                    <BsGraphUp />
                    <p className='text-[0.65rem]'>Analytics</p>
                </div>
            </Link>
        </div>
    );
};

export default Navbar;
