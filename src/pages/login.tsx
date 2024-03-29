import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { LoginMutation, LoginMutationVariables } from "../__api__/LoginMutation";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { CustomHelmet } from "../components/helmet";

export const LOGIN_MUTATION = gql`
    mutation LoginMutation($loginInput: LoginInput!) {
        login(input: $loginInput) {
            ok
            token
            error
        }
    }
`;

interface ILoginForm {
    email: string;
    password: string;
}

export const Login = () => {
    const {
        register,
        getValues,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<ILoginForm>({
        mode: "onChange",
    });
    const onCompleted = (data: LoginMutation) => {
        const { ok, token } = data.login;

        if (ok && token) {
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authToken(token);
            isLoggedInVar(true);
        }
    };

    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
        LoginMutation,
        LoginMutationVariables
    >(LOGIN_MUTATION, {
        onCompleted,
    });
    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();
            loginMutation({
                variables: {
                    loginInput: { email, password },
                },
            });
        }
    };

    return (
        <div className="h-screen flex sm items-center flex-col mt-10 lg:mt-28">
            <CustomHelmet content="Login" />
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} alt="nuber-logo" className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
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
                    <Button canClick={isValid} loading={loading} actionText={"Log In"} />
                    {loginMutationResult?.login.error && (
                        <FormError errorMessage={loginMutationResult.login.error} />
                    )}
                </form>
                <div className="mt-3">
                    New to Nuber?{" "}
                    <Link to="/create-account" className="text-lime-600 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};
