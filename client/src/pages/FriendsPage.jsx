import FriendList from '@/components/friends/FriendList';

const FriendsPage = () => {
    return (
        <div className="flex flex-col justify-center items-center px-4 py-2 w-full h-full bg-lc-gray-2 text-white">
            <FriendList />
        </div>
    );
};

export default FriendsPage;
