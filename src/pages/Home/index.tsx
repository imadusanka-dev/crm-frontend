
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../services/customer.service";
import CustomerCardContainer from "../../components/CustomerCardContainer";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import { useState } from "react";
import type { ICustomer } from "../../types";

const Home = () => {
    const [searchValue, setSearchValue] = useState("");
    const { data: customers, isLoading } = useQuery<ICustomer[]>({
        queryKey: ["customers", searchValue],
        queryFn: () => getCustomers(searchValue),
    });

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <SearchBar onSearch={handleSearch} size="large" />
            </div>
            {isLoading ? <Loading /> : <CustomerCardContainer customers={customers} />}
        </div>
    );
};

export default Home;