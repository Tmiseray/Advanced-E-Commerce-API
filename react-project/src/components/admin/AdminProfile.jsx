
import { Container } from "react-bootstrap"
import { useEffect, useState } from "react";

function AdminProfile() {
    const [ isLoggedIn, setIsLoggedIn ] = useState(null);
    const [ isAdmin, setIsAdmin ] = useState(null);

    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
        const adminStatus = sessionStorage.getItem('isAdmin');

        if (storedLoginStatus) {
            setIsLoggedIn(JSON.parse(storedLoginStatus));
        } else {
            setIsLoggedIn(false);
        }

        if (adminStatus) {
            setIsAdmin(JSON.parse(adminStatus));
        } else {
            setIsAdmin(false);
        }

    }, [isLoggedIn, isAdmin]);

    return (
        <Container>
            <p>Work in progress</p>
        </Container>
    )
};

export default AdminProfile;