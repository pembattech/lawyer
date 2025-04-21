import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login'); // Navigate to login
        }
    }, [navigate]);
};

export default useAuthRedirect;
