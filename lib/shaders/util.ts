export const decodeShaderData = (data: string) => {
    const base64 = data.split(";")[1].replace("base64,", "");
    return atob(base64);
};
