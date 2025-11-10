import { useParams } from "react-router-dom";
import { getCustomerById } from "../../services/customer.service";
import { useQuery } from "@tanstack/react-query";
import type { ICustomer } from "../../types";
import Loading from "../../components/Loading";
import NoRecords from "../../components/NoRecords";
import CustomerDetails from "../../components/CustomerDetails";

const ViewCustomer = () => {
    const { id } = useParams();

    const { data: customer, isLoading } = useQuery<ICustomer | undefined>({
        queryKey: ["customer", id],
        queryFn: () => getCustomerById(id as string),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;

    if (!isLoading && !customer) return <NoRecords message="Customer not found" description="Invalid customer id" />;

    return (
        <div>
            {customer && <CustomerDetails customer={customer} />}
        </div>
    )
}

export default ViewCustomer;