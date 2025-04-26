import React from "react";

interface CompanyEmployeesClientProps {
    params: { id: string };
}

const CompanyEmployeesClient: React.FC<CompanyEmployeesClientProps> = ({
    params,
}) => {
    // You can fetch and display employees here based on params.id
    return (
        <div>
            <h2>Employees for Company ID: {params.id}</h2>
            {/* Render employee list or other company details here */}
        </div>
    );
};

export default CompanyEmployeesClient;
