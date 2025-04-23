import type { User } from "@/types/user"
import type  {Membership}  from "@/types/membership"
import { Company } from "@/types/company"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    membership: "premium",
    status: "active",
    companyId: 1
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    membership: "basic",
    status: "active",
    companyId: 2
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "manager",
    membership: "enterprise",
    status: "active",
    companyId: 2
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    membership: "none",
    status: "inactive",
    companyId: 1
  },
]

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Company 1",
    email: "Company1@example.com",
    role: "admin",
    membership: "premium",
    status: "active",
  },
  {
    id: "2",
    name: "Company 2",
    email: "jane@example.com",
    role: "user",
    membership: "basic",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "manager",
    membership: "enterprise",
    status: "active",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    membership: "none",
    status: "inactive",
  },
]

export const mockMemberships: Membership[] = [
  {
    id: "1",
    name: "Basic Plan",
    price: 9.99,
    billingCycle: "monthly",
    features: ["5 Users", "Basic Support", "1GB Storage"],
    status: "active",
  },
  {
    id: "2",
    name: "Premium Plan",
    price: 19.99,
    billingCycle: "monthly",
    features: ["10 Users", "Priority Support", "5GB Storage", "Advanced Analytics"],
    status: "active",
  },
  {
    id: "3",
    name: "Enterprise Plan",
    price: 49.99,
    billingCycle: "monthly",
    features: ["Unlimited Users", "24/7 Support", "20GB Storage", "Advanced Analytics", "Custom Integrations"],
    status: "active",
  },
]
