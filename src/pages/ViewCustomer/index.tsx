import { useParams } from "react-router-dom";
import { getCustomerById, updateCustomer, deleteCustomer } from "../../services/customer.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ICustomer } from "../../types";
import Loading from "../../components/Loading";
import NoRecords from "../../components/NoRecords";
import CustomerDetails from "../../components/CustomerDetails";
import AddCustomerModal from "../../components/AddCustomerModal";
import { useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const ViewCustomer = () => {
    const { id } = useParams();
    const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: customer, isLoading } = useQuery<ICustomer | undefined>({
        queryKey: ["customer", id],
        queryFn: () => getCustomerById(id as string),
        enabled: !!id,
    });

    const { mutate: updateCustomerMutation } = useMutation({
        mutationFn: (customer: Omit<ICustomer, 'id' | 'createdAt'>) => updateCustomer(id as string, customer),
        onSuccess: () => {
            messageApi.success("Customer updated successfully");
            queryClient.invalidateQueries({ queryKey: ["customer", id] });
            setOpenAddCustomerModal(false);
            navigate("/");
        },
        onError: (error: AxiosError) => {
            messageApi.error((error.response?.data as { message: string })?.message || "Failed to update customer");
        }
    });

    const { mutate: deleteCustomerMutation } = useMutation({
        mutationFn: (id: string) => deleteCustomer(id),
        onSuccess: () => {
            messageApi.success("Customer deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["customer", id] });
            navigate("/");
        },
        onError: (error: AxiosError) => {
            messageApi.error((error.response?.data as { message: string })?.message || "Failed to delete customer");
        }
    });

    const handleEdit = () => {
        setOpenAddCustomerModal(true);
    };

    const handleEditCustomer = (values: Omit<ICustomer, 'id' | 'createdAt'>) => {
        updateCustomerMutation(values);
    };

    const handleDeleteCustomer = () => {
        deleteCustomerMutation(id as string);
    };

    if (isLoading) return <Loading />;

    if (!isLoading && !customer) return <NoRecords message="Customer not found" description="Invalid customer id" />;

    return (
        <div>
            {contextHolder}
            {customer && <CustomerDetails customer={customer} onEdit={handleEdit} onDelete={handleDeleteCustomer} />}
            <AddCustomerModal 
                open={openAddCustomerModal} 
                onCancel={() => setOpenAddCustomerModal(false)} 
                onFinish={handleEditCustomer} 
                customer={customer}
            />
        </div>
    )
}

export default ViewCustomer;