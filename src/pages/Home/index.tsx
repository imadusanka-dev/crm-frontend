
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../services/customer.service";
import CustomerCardContainer from "../../components/CustomerCardContainer";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import { useState } from "react";
import type { ICustomer } from "../../types";
import NoRecords from "../../components/NoRecords";

const Home = () => {
    const [searchValue, setSearchValue] = useState("");
    const { data: customers, isLoading } = useQuery<ICustomer[]>({
        queryKey: ["customers", searchValue],
        queryFn: () => getCustomers(searchValue),
    });

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const handleChange = (value: string) => {
        setSearchValue(value);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <SearchBar onSearch={handleSearch} onChange={handleChange} size="large" />
            </div>
            {isLoading ? <Loading /> : 
            customers && customers.length > 0 ? 
            <CustomerCardContainer customers={customers} /> : 
            <NoRecords message="No records found" description="Please try again with a different search." />}
        </div>
    );
};

export default Home;