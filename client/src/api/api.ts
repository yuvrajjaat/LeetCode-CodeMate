const API_BASE = 'http://localhost:8080/api';

export const getUserDetail = async (username: string) => {
    const res = await fetch(`${API_BASE}/users/${username}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `User not found`);
    }
    return res.json();
};

export const createUser = async (username: string) => {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create user');
    }
    return res.json();
};

export const getFriends = async (username: string) => {
    const res = await fetch(`${API_BASE}/friends/${username}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch friends');
    }
    return res.json();
};

export const addFriend = async (userUsername: string, friendUsername: string) => {
    const res = await fetch(`${API_BASE}/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userUsername, friendUsername })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add friend');
    }
    return res.json();
};

export const getInstitutes = async () => {
    const res = await fetch(`${API_BASE}/institutes`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch institutes');
    }
    return res.json();
};

export const getInstitute = async (id: number) => {
    const res = await fetch(`${API_BASE}/institutes/${id}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch institute');
    }
    return res.json();
};

export const createInstitute = async (username: string, name: string, city: string, logo?: string) => {
    const res = await fetch(`${API_BASE}/institutes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, city, logo })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to create institute');
    }
    return res.json();
};

export const setInstitute = async (username: string, instituteId: number) => {
    const res = await fetch(`${API_BASE}/institutes/set`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, instituteId })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to set institute');
    }
    return res.json();
};

export const getBatchmates = async (username: string) => {
    const res = await fetch(`${API_BASE}/institutes/batchmates/${username}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch batchmates');
    }
    return res.json();
};

export const removeFriend = async (userUsername: string, friendUsername: string) => {
    const res = await fetch(`${API_BASE}/friends`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userUsername, friendUsername })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to remove friend');
    }
    return res.json();
};

export const leaveInstitute = async (username: string) => {
    const res = await fetch(`${API_BASE}/institutes/leave`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to leave institute');
    }
    return res.json();
};

export const getAnalytics = async (username: string) => {
    const res = await fetch(`${API_BASE}/analytics/${username}`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch analytics');
    }
    return res.json();
};

export const getUpcomingContests = async () => {
    const res = await fetch(`${API_BASE}/analytics/contests`);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch contests');
    }
    return res.json();
};
