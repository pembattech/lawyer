import React, { useEffect, useState } from "react";

const LawyerAppointments = ({ lawyerId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        if (!lawyerId) return;

        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch(
                    `http://127.0.0.1:8000/api/appointments/?lawyer=${lawyerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                const sorted = [...data].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setAppointments(sorted);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [lawyerId]);

    const handleClickAppointment = async (appointment) => {
        if (!appointment.isseen) {
            try {
                const token = localStorage.getItem("accessToken");
                await fetch(`http://127.0.0.1:8000/api/appointments/${appointment.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isseen: true }),
                });

                // Optimistically update the appointment in state
                setAppointments((prev) =>
                    prev.map((a) => (a.id === appointment.id ? { ...a, isseen: true } : a))
                );
            } catch (error) {
                console.error("Failed to update isseen status", error);
            }
        }

        setSelectedAppointment(appointment); // Show modal
    };

    const closeModal = () => {
        setSelectedAppointment(null);
    };

    if (loading) return <p className="text-center mt-10">Loading appointments...</p>;

    return (
        <div className="max-w-3xl mx-auto my-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Appointments</h2>
            {appointments.length === 0 ? (
                <p className="text-center text-gray-100">No appointments found.</p>
            ) : (
                <ul className="space-y-3">
                    {appointments.map((appointment) => (
                        <li
                            key={appointment.id}
                            onClick={() => handleClickAppointment(appointment)}
                            className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-200 ${
                                appointment.isseen ? "bg-white" : "bg-yellow-100"
                            } border border-gray-200 hover:shadow-lg`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-lg">{appointment.name}</p>
                                    <p className="text-sm text-gray-600">{appointment.email}</p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Service:</strong> {appointment.service_needed}
                                    </p>
                                </div>
                                {!appointment.isseen && (
                                    <span className="text-xs font-medium bg-yellow-400 text-white px-2 py-1 rounded-full">
                                        New
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-black"
                            onClick={closeModal}
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Appointment Details
                        </h3>
                        <p><strong>Name:</strong> {selectedAppointment.name}</p>
                        <p><strong>Email:</strong> {selectedAppointment.email}</p>
                        <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
                        <p><strong>Date:</strong> {selectedAppointment.preferred_date}</p>
                        <p><strong>Time:</strong> {selectedAppointment.preferred_time}</p>
                        <p><strong>Service:</strong> {selectedAppointment.service_needed}</p>
                        <p><strong>Description:</strong> {selectedAppointment.description || "N/A"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyerAppointments;
