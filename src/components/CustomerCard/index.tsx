import { Link } from "react-router-dom";

interface CustomerCardProps {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
}

const CustomerCard = ({ firstName, lastName, email, id }: CustomerCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 relative">
            <Link to={`/customer/${id}`}>
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                    aria-label="View more details"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </button>
            </Link>
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {firstName} {lastName}
                    </h2>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-600 text-sm">
                    <span className="font-medium">Email:</span> {email}
                </p>
            </div>
        </div>
    );
};

export default CustomerCard;