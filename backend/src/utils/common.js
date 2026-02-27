function maskEmail(email) {
    const [user, domain] = email.split("@");
    return (user[0] ?? "") + "***@" + (domain ?? "");
}

export const logRequest = (email = "", promoCode = "", result = "") => {
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    console.log(
        `[${timestamp}] - Email ID: ${maskEmail(email)} | Code: ${promoCode} | Result: ${result}`,
    );
};
