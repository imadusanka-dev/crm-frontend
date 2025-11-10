import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message } from "antd";

import { getCustomers, createCustomer } from "../../services/customer.service";

import CustomerCardContainer from "../../components/CustomerCardContainer";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import NoRecords from "../../components/NoRecords";
import AddCustomerModal from "../../components/AddCustomerModal";
import type { ICustomer } from "../../types";
import type { AxiosError } from "axios";

const Home = () => {
    const [searchValue, setSearchValue] = useState("");
    const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();
    const { data: customers, isLoading } = useQuery<ICustomer[]>({
        queryKey: ["customers", searchValue],
        queryFn: () => getCustomers(searchValue),
    });

    const { mutate: createCustomerMutation } = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers", searchValue] });
            setOpenAddCustomerModal(false);
            messageApi.success("Customer created successfully");
        },
        onError: (error: AxiosError) => {
            messageApi.error((error.response?.data as { message: string })?.message || "Failed to create customer");
        },
    });

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const handleChange = (value: string) => {
        setSearchValue(value);
    };

    const handleAddCustomer = (values: Omit<ICustomer, 'id' | 'createdAt'>) => {
        createCustomerMutation(values);
    };

    return (
        <div>
            {contextHolder}
            <div className="flex justify-between items-center mb-4 gap-8">
                <SearchBar onSearch={handleSearch} onChange={handleChange} size="large" />
                <Button type="primary" size="large" onClick={() => setOpenAddCustomerModal(true)}>
                    Add Customer
                </Button>
            </div>
            {isLoading ? <Loading /> : 
            customers && customers.length > 0 ? 
            <CustomerCardContainer customers={customers} /> : 
            <NoRecords message="No records found" description="Please try again with a different search." />}
            <AddCustomerModal open={openAddCustomerModal} onCancel={() => setOpenAddCustomerModal(false)} onFinish={handleAddCustomer} />
        </div>
    );
};

export default Home;