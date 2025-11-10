
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../services/customer.service";
import CustomerCardContainer from "../../components/CustomerCardContainer";
import Loading from "../../components/Loading";

const Home = () => {
    const { data: customers, isLoading } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });

    return (
        <>
            {isLoading ? <Loading /> : <CustomerCardContainer customers={customers} />}
        </>
    );
};

export default Home;