const { origin, pathname } = window.location;
const BASE_URL = `${origin}${pathname}`;

export async function getToolState(roomId: string) {
    const toolStateResponse = await fetch(`${BASE_URL}/api/state?roomId=${roomId}`);
    const toolStateResult = await toolStateResponse.json();

    return toolStateResult;
}

export async function postRole(roomId: string, personName: string, roleName: string) {
    return fetch(`${BASE_URL}/api/role?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify({
            roleName, personName
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
}

export async function deleteRole(roomId: string, roleId: string) {
    return fetch(`${BASE_URL}/api/role?roomId=${roomId}&roleId=${roleId}`, {
        method: "DELETE"
    })
}