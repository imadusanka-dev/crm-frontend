import NavBar from "../NavBar";

const DashboardContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <NavBar />
            <div className="flex-1 overflow-y-auto container mx-auto px-4 py-4">
                {children}
            </div>
        </div>
    );
};

export default DashboardContainer;