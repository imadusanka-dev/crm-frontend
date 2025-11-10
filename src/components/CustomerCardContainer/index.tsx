import CustomerCard from "../CustomerCard";
import type { ICustomer } from "../../types";

interface CustomerCardContainerProps {
    customers: ICustomer[] | undefined;
}

const CustomerCardContainer = ({ customers }: CustomerCardContainerProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers?.map((customer) => (
                <CustomerCard key={customer.id} id={customer.id} firstName={customer.firstName} lastName={customer.lastName} email={customer.email} />
            ))}
        </div>
    );
};

export default CustomerCardContainer;