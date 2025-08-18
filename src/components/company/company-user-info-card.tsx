import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as UserModel from "@/types/user";
interface CompanyUserInfoCardProps {
    user: UserModel.UserResponse;
}

export function CompanyUserInfoCard({ user }: CompanyUserInfoCardProps) {
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
                >
                    <UserCheck className="h-3 w-3 mr-1" />
                    {user.role === 1 ? "Admin" : "Owner"}
                </Badge>
                <div>
                    <div className="flex items-center space-x-2">
                        <p className="font-medium">{user.name}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{user.email}</span>
                </div>
                {user.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
