import Appbar from '@/components/common/Appbar';
import Navbar from '@/components/common/Navbar';

const CommonLayout = ({ children }) => {
    return (
        <div>
            <Appbar />
            <div className="bg-lc-gray-2 py-[5rem] ">
                {children}
            </div>
            <Navbar />
        </div>
    );
};

export default CommonLayout;
