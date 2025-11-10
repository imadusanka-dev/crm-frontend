import { Button, Popconfirm } from "antd";
import type { ICustomer } from "../../types";

interface CustomerDetailsProps {
    customer: ICustomer;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CustomerDetails = ({ customer, onEdit, onDelete }: CustomerDetailsProps) => {
    const formatDate = (date: Date | string) => {
        if (!date) return "N/A";
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) => (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-blue-500 mt-1">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <p className="text-base text-gray-900">{value || "N/A"}</p>
            </div>
        </div>
    );

    const IconWrapper = ({ children }: { children: React.ReactNode }) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {children}
        </svg>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {customer.firstName.charAt(0).toUpperCase()}
                        {customer.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            {customer.firstName} {customer.lastName}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    {onEdit && (
                        <Button
                            type="primary"
                            onClick={onEdit}
                            className="flex items-center gap-2"
                            data-testid="edit-customer-button"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Popconfirm title="Are you sure you want to delete this customer?" onConfirm={onDelete} onCancel={() => {}} okText="Delete" cancelText="Cancel">
                            <Button
                            danger
                            className="flex items-center gap-2"
                            data-testid="delete-customer-button"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <IconWrapper>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </IconWrapper>
                    Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                        icon={
                            <IconWrapper>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </IconWrapper>
                        }
                        label="Email"
                        value={customer.email}
                    />
                    <DetailItem
                        icon={
                            <IconWrapper>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </IconWrapper>
                        }
                        label="Phone Number"
                        value={customer.phoneNumber}
                    />
                </div>
            </div>

            {/* Address Information Section */}
            {(customer.address || customer.city || customer.state || customer.country) && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <IconWrapper>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </IconWrapper>
                        Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.address && (
                            <div className="md:col-span-2">
                                <DetailItem
                                    icon={
                                        <IconWrapper>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </IconWrapper>
                                    }
                                    label="Address"
                                    value={customer.address}
                                />
                            </div>
                        )}
                        <DetailItem
                            icon={
                                <IconWrapper>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </IconWrapper>
                            }
                            label="City"
                            value={customer.city}
                        />
                        <DetailItem
                            icon={
                                <IconWrapper>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </IconWrapper>
                            }
                            label="State"
                            value={customer.state}
                        />
                        <DetailItem
                            icon={
                                <IconWrapper>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M11 3.055V5a2 2 0 002 2h1a2 2 0 002 2 2 2 0 002 2v2.945M21 20.945V19a2 2 0 00-2-2h-1a2 2 0 00-2-2 2 2 0 00-2-2h-2.945M13 21.945V19a2 2 0 012-2h1a2 2 0 012-2 2 2 0 012-2v-2.945M3.055 11V9a2 2 0 012-2h1a2 2 0 012-2 2 2 0 012-2h2.945" />
                                </IconWrapper>
                            }
                            label="Country"
                            value={customer.country}
                        />
                    </div>
                </div>
            )}

            {/* Additional Information */}
            <div className="pt-4 border-t border-gray-200">
                <DetailItem
                    icon={
                        <IconWrapper>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </IconWrapper>
                    }
                    label="Member Since"
                    value={formatDate(customer.createdAt)}
                />
            </div>
        </div>
    );
};

export default CustomerDetails;