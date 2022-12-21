import auth from "@utils/auth";

export async function getEmployeeById(userId, { signal }) {
    return await auth.get("/employees/" + userId, { signal });
}

export async function editEmployee({ id, ...rest }) {
    return await auth.put(`/employees/${id}`, rest);
}