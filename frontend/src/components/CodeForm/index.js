import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import {
    EMAIL_VALIDATION,
    PROMOCODE_VALIDATION,
} from "../../utils/validations";
import style from "./index.module.css";

const PromoCodeForm = () => {
    const { control, formState, handleSubmit, reset } = useForm();
    const [message, setMessage] = useState("");

    const handleFormSubmit = async (formValues) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/validate-promo",
                {
                    email: formValues.email.trim(),
                    promo_code: formValues.promo_code.trim(),
                },
            );

            if (res.data.success) {
                setMessage(
                    `${res.data?.message} | Discount: ${res.data.discount}%`,
                );
                reset({ email: "", promo_code: "" });
            }
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Something went wrong. Please try again.";
            setMessage(msg);
        }
    };

    return (
        <div className={style.container}>
            <h2>Promo Code Validator</h2>
            {!!message && <div className={style.responseMsg}>{message}</div>}

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "Email is required",
                        validate: {
                            notOnlySpaces: (value) =>
                                value.trim() !== "" ||
                                "Email cannot be just spaces",
                            validEmail: (value) =>
                                EMAIL_VALIDATION.test(value) ||
                                "Invalid email format",
                        },
                    }}
                    render={({
                        field: { value, onChange },
                        fieldState: { error },
                    }) => (
                        <div className={style.inputWrapper}>
                            <input
                                placeholder="Enter Email ID"
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value);
                                    if (message) setMessage("");
                                }}
                            />
                            {!!error?.message && <p>{error.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    control={control}
                    name="promo_code"
                    rules={{
                        required: "Promo code is required",
                        validate: {
                            notOnlySpaces: (value) =>
                                value.trim() !== "" ||
                                "Promo code cannot be just spaces",
                            validEmail: (value) =>
                                PROMOCODE_VALIDATION.test(value) ||
                                "Invalid code format",
                        },
                    }}
                    render={({
                        field: { value, onChange },
                        fieldState: { error },
                    }) => (
                        <div className={style.inputWrapper}>
                            <input
                                placeholder="Enter Promo Code"
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value.toUpperCase());
                                    if (message) setMessage("");
                                }}
                            />
                            {!!error?.message && <p>{error.message}</p>}
                        </div>
                    )}
                />

                <button type="submit" disabled={formState.isSubmitting}>
                    {formState.isSubmitting ? "Validating..." : "Apply Code"}
                </button>
            </form>
        </div>
    );
};

export default PromoCodeForm;
