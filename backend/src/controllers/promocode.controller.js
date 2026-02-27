import { promoCodes } from "../constants/promoCodes.js";
import {
    EMAIL_VALIDATION,
    PROMOCODE_VALIDATION,
} from "../constants/validations.js";
import { logRequest } from "../utils/common.js";

export const PromocodeControllers = () => {
    const validateCode = (req, res) => {
        const { email, promo_code } = req.body;

        if (!email || !promo_code) {
            let msg = "";
            if (!email) {
                msg = "Email missing";
            }
            if (!promo_code) {
                msg = "Promo code missing";
            }
            if (!email && !promo_code) {
                msg = "Email and promo code missing";
            }

            logRequest(email, promo_code, msg);
            return res.status(400).json({
                success: false,
                error_code: "INVALID_PAYLOAD",
                message: msg,
            });
        }

        if (!EMAIL_VALIDATION.test(email)) {
            logRequest(email, promo_code, "Invalid email format");
            return res.status(400).json({
                success: false,
                error_code: "INVALID_EMAIL_FORMAT",
                message: "Invalid email format",
            });
        }

        if (!PROMOCODE_VALIDATION.test(promo_code)) {
            logRequest(email, promo_code, "Invalid promocode format");
            return res.status(400).json({
                success: false,
                error_code: "INVALID_PROMOCODE_FORMAT",
                message: "Invalid promocode format",
            });
        }

        const foundCode = promoCodes.find((p) => p.code === promo_code);

        if (!foundCode) {
            logRequest(email, promo_code, "Promo code not found");
            return res.status(404).json({
                success: false,
                error_code: "PROMOCODE_NOT_FOUND",
                message: "Promo code not found",
            });
        }

        const today = new Date();
        const expiryDate = new Date(foundCode.expiry);

        if (today > expiryDate) {
            logRequest(email, promo_code, "Promo code expired");
            return res.status(400).json({
                success: false,
                error_code: "PROMO_EXPIRED",
                message: "This promo code has expired",
            });
        }

        if (foundCode.elapsedUses === 0) {
            logRequest(email, promo_code, "Promo code usage limit reached");
            return res.status(400).json({
                success: false,
                error_code: "PROMO_LIMIT_REACHED",
                message: "Promo code usage limit reached",
            });
        }

        foundCode.currentUses += 1;
        foundCode.elapsedUses -= 1;

        logRequest(email, promo_code, "Promo code applied");
        return res.json({
            success: true,
            discount: foundCode.discountPercentage,
            message: "Promo code applied successfully",
        });
    };

    return { validateCode };
};
