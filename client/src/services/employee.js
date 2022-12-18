import auth from "@utils/auth";

export async function getEmployeeById(userId, { signal }) {
    return await auth.get("/employees/" + userId, { signal });
}