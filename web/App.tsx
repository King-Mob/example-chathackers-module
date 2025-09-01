import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getToolState, postRole, deleteRole } from "./requests";
import { type State } from "../types";

export default function App() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");
    const [toolState, setToolState] = useState<State>();
    const [assignVisible, setAssignVisible] = useState(false);
    const [newPersonName, setNewPersonName] = useState("");
    const [newRoleName, setNewRoleName] = useState("");

    async function loadToolState(roomId: string) {
        const toolState = await getToolState(roomId);
        console.log(toolState)
        setToolState(toolState);
    }

    useEffect(() => {
        if (roomId) {
            loadToolState(roomId);
        }
    }, [])

    async function createRole() {
        if (roomId) {
            await postRole(roomId, newPersonName, newRoleName);
            setNewPersonName("");
            setNewRoleName("");
            setAssignVisible(false);
            loadToolState(roomId);
        }
    }

    async function removeRole(roleId: string) {
        if (roomId) {
            await deleteRole(roomId, roleId);
            loadToolState(roomId);
        }
    }

    return <div>
        <h1>Example Tool dashboard</h1>
        {toolState && <div>
            {toolState.assignedRoles.map(assigned => <div>
                <p>{assigned.person.name} - {assigned.role.name}</p>
                <button onClick={() => removeRole(assigned.id)}>Remove</button>
            </div>)}
            {assignVisible ?
                <>
                    <input type="text" placeholder="Name of person" value={newPersonName} onChange={e => setNewPersonName(e.target.value)}></input>
                    <input type="text" placeholder="Name of role" value={newRoleName} onChange={e => setNewRoleName(e.target.value)}></input>
                    <button onClick={createRole}>Assign</button>
                    <button onClick={() => setAssignVisible(false)}>Cancel</button>
                </>
                : <button onClick={() => setAssignVisible(true)}>Assign New Role</button>}
        </div>}
    </div>
}