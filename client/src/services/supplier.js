import auth from "@utils/auth";

export async function getAllSupplier({ signal }) {
    return await auth.get("/suppliers", { signal });
}