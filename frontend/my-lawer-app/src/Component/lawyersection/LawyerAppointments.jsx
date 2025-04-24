import React, { useEffect, useState } from "react";

const LawyerAppointments = ({ lawyerId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lawyerId) return;

        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const res = await fetch(`http://127.0.0.1:8000/api/appointments/?lawyer=${lawyerId}`, config);
                const data = await res.json();
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [lawyerId]);

    if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

    return (
        <div className="max-w-3xl mx-auto my-10">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">Appointments</h2>
            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">No appointments found.</p>
            ) : (
                <ul className="space-y-4">
                    {appointments.map((appointment) => (
                        <li
                            key={appointment.id}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <p><strong>Name:</strong> {appointment.name}</p>
                            <p><strong>Email:</strong> {appointment.email}</p>
                            <p><strong>Phone:</strong> {appointment.phone}</p>
                            <p><strong>Date:</strong> {appointment.preferred_date}</p>
                            <p><strong>Time:</strong> {appointment.preferred_time}</p>
                            <p><strong>Service:</strong> {appointment.service_needed}</p>
                            <p><strong>Message:</strong> {appointment.description || "N/A"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LawyerAppointments;
