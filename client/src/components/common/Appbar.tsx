const Appbar = () => {
    return (
        <div className='flex justify-center items-center gap-2 bg-lc-gray-1 p-4 w-full fixed top-0 z-[500]'>
            <img
                className='-translate-y-1'
                src="/images/lc-logo-dark.png"
                alt="leetcode-logo"
                width={28}
                height={12}
            />
            <p> <span className='text-white text-2xl'>LeetCode CodeMate</span> </p>
        </div>
    );
};

export default Appbar;
