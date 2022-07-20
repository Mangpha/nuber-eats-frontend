import React from "react";
import { Helmet } from "react-helmet-async";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import { UserRole } from "../__api__/globalTypes";
import {
    CreateAccountMutation,
    CreateAccountMutationVariables,
} from "../__api__/CreateAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
    mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok
            error
        }
    }
`;

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {
    const navigate = useNavigate();
    const {
        register,
        getValues,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<ICreateAccountForm>({
        mode: "onChange",
        defaultValues: {
            role: UserRole.Client,
        },
    });
    const onCompleted = (data: CreateAccountMutation) => {
        const { ok } = data.createAccount;
        if (ok) {
            alert("Account Created!");
            navigate("/");
        }
    };
    const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
        CreateAccountMutation,
        CreateAccountMutationVariables
    >(CREATE_ACCOUNT_MUTATION, {
        onCompleted,
    });
    const onSubmit = () => {
        const { email, password, role } = getValues();
        if (!loading) {
            createAccountMutation({
                variables: {
                    createAccountInput: { email, password, role },
                },
            });
        }
    };

    return (
        <div className="h-screen flex sm items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} alt="nuber-logo" className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 my-5 w-full">
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        })}
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        className="input"
                    />
                    {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
                    {errors.email?.type === "pattern" && (
                        <FormError errorMessage={"Please enter a valid email"} />
                    )}
                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: 10,
                        })}
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        className="input"
                    />
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message} />
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage="Password must be more than 10 chars." />
                    )}
                    <select className="input" {...register("role", { required: true })} name="role">
                        {Object.keys(UserRole).map((role, index) => (
                            <option key={index}>{role}</option>
                        ))}
                    </select>
                    <Button canClick={isValid} loading={loading} actionText={"Create Account"} />
                </form>
                {createAccountMutationResult?.createAccount.error && (
                    <FormError errorMessage={createAccountMutationResult?.createAccount.error} />
                )}
                <div className="mt-3">
                    Already have an account?{" "}
                    <Link to="/" className="text-lime-600 hover:underline">
                        Log In now
                    </Link>
                </div>
            </div>
        </div>
    );
};
