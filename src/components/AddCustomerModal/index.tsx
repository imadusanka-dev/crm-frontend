import { Modal, Form, Input, Button } from "antd";
import type { ICustomer } from "../../types";

interface AddCustomerModalProps {
    open: boolean;
    onCancel: () => void;
    onFinish: (values: Omit<ICustomer, 'id' | 'createdAt'>) => void;
    customer?: ICustomer;
}

const AddCustomerModal = ({ open, onCancel, onFinish, customer }: AddCustomerModalProps) => {
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleSubmit = (values: Omit<ICustomer, 'id' | 'createdAt'>) => {
        onFinish(values);
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            title={customer ? "Edit Customer" : "Add New Customer"}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                initialValues={customer}
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        { required: true, message: 'Please enter first name' },
                        { min: 2, message: 'First name must be at least 2 characters' },
                    ]}
                >
                    <Input placeholder="Enter first name" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        { required: true, message: 'Please enter last name' },
                        { min: 2, message: 'Last name must be at least 2 characters' },
                    ]}
                >
                    <Input placeholder="Enter last name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email address' },
                        { type: 'email', message: 'Please enter a valid email address' },
                    ]}
                >
                    <Input placeholder="Enter email address" type="email" />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        {
                            pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                            message: 'Please enter a valid phone number',
                        },
                    ]}
                >
                    <Input placeholder="Enter phone number" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input.TextArea
                        placeholder="Enter address"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    label="City"
                    name="city"
                >
                    <Input placeholder="Enter city" />
                </Form.Item>

                <Form.Item
                    label="State"
                    name="state"
                >
                    <Input placeholder="Enter state" />
                </Form.Item>

                <Form.Item
                    label="Country"
                    name="country"
                >
                    <Input placeholder="Enter country" />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button data-testid="cancel-button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" data-testid="submit-button">
                            {customer ? "Save Changes" : "Add Customer"}    
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCustomerModal;