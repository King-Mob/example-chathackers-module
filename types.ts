export type AssignedRole = {
    id: string;
    person: {
        name: string;
    };
    role: {
        name: string;
    }
}

export type State = {
    assignedRoles: AssignedRole[]
}