const URL_BACKEND = "http://localhost:3006/api"
export const PeticionGet = async (key, url) => {
    const headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "GET",
        headers: headers,
    })).json();
    return datos;
}
export const PeticionPost = async (key, url,data) => {
    const headers = {
        "Content-Type": "application/json",
        "X-API-TOKEN": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })).json();
    return datos;
}