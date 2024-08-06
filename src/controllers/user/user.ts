import { UserRole } from "@interfaces/controllers/user/user";

export class User
{
    private id: number;
    private name: string;
    private surnames: string;
    private email: string;
    private password: string;
    private userRole: UserRole;

    constructor(id: number, name: string, surnames: string, email: string, password: string, userRole: UserRole)
    {
        this.id = id;
        this.name = name;
        this.surnames = surnames;
        this.email = email;
        this.password = password;
        this.userRole = userRole;
    }


}