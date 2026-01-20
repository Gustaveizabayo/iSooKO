
const login = async (email, password) => {
    const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.access_token;
};

const updateProfile = async (token, bio) => {
    const res = await fetch('http://localhost:3000/profiles/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bio }),
    });
    if (!res.ok) throw new Error(`Update profile failed: ${res.status} ${await res.text()}`);
    return res.json();
};

const getPendingProfiles = async (token) => {
    const res = await fetch('http://localhost:3000/admin/profiles/pending', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Get pending failed: ${res.status} ${await res.text()}`);
    return res.json();
};

const adminAction = async (token, profileId, action) => {
    const res = await fetch(`http://localhost:3000/admin/profiles/${profileId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error(`Admin action failed: ${res.status} ${await res.text()}`);
    return res.json();
};

async function main() {
    try {
        console.log('Logging in...');
        const instructorToken = await login('instructor@example.com', 'password123');
        const adminToken = await login('admin@example.com', 'password123');
        console.log('Logged in successfully.');

        console.log('Instructor updating profile...');
        const updatedProfile = await updateProfile(instructorToken, 'New Updated Bio - Pending Review ' + Date.now());
        console.log(`Profile updated. ID: ${updatedProfile.id}, Status: ${updatedProfile.status}`);

        if (updatedProfile.status !== 'PENDING') throw new Error(`Status should be PENDING but got ${updatedProfile.status}`);

        console.log('Admin checking pending profiles...');
        const pending = await getPendingProfiles(adminToken);
        console.log(`Found ${pending.length} pending profiles.`);
        console.log('Pending IDs:', pending.map(p => p.id));

        const target = pending.find(p => p.id === updatedProfile.id);
        if (!target) throw new Error(`Instructor profile ${updatedProfile.id} not found in pending list`);

        console.log('Found instructor profile in pending list.');

        console.log('Admin approving profile...');
        const approved = await adminAction(adminToken, target.id, 'APPROVE');
        console.log(`Admin Action result: ${approved.status}`);

        if (approved.status !== 'ACTIVE') throw new Error(`Status should be ACTIVE but got ${approved.status}`);

        console.log('TEST FLOW PASSED');

    } catch (e) {
        console.error('TEST FAILED:', e.message);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

main();
