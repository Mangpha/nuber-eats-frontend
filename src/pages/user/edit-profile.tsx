import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { CustomHelmet } from "../../components/helmet";
import { Title } from "../../components/title";
import { useMe } from "../../hooks/useMe";
import {
    EditProfileMutation,
    EditProfileMutationVariables,
} from "../../__api__/EditProfileMutation";

const EDIT_PROFILE_MUTATION = gql`
    mutation EditProfileMutation($input: EditProfileInput!) {
        editProfile(input: $input) {
            ok
            error
        }
    }
`;

interface IFormProps {
    email?: string;
    password?: string;
}

export const EditProfile = () => {
    const { data: userData } = useMe();
    const client = useApolloClient();
    const onCompleted = (data: EditProfileMutation) => {
        const { ok } = data.editProfile;
        if (ok && userData) {
            const { email: prevEmail, id } = userData.me;
            const { email: newEmail } = getValues();
            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                        fragment EditedProfile on User {
                            verified
                            email
                        }
                    `,
                    data: {
                        verified: false,
                        email: newEmail,
                    },
                });
            }
        }
    };
    const [editProfileMutation, { loading }] = useMutation<
        EditProfileMutation,
        EditProfileMutationVariables
    >(EDIT_PROFILE_MUTATION, {
        onCompleted,
    });
    const {
        register,
        handleSubmit,
        getValues,
        formState: { isValid },
    } = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            email: userData?.me.email,
        },
    });
    const onSubmit = () => {
        const { email, password } = getValues();
        editProfileMutation({
            variables: {
                input: {
                    email,
                    ...(password !== "" && { password }),
                },
            },
        });
    };

    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <CustomHelmet content="Edit Profile" />
            <Title title="Edit Profile" />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-3 my-5 w-full max-w-screen-sm"
            >
                <input
                    {...register("email", {
                        pattern:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Input Email"
                />
                <input
                    {...register("password", { minLength: 10 })}
                    name="password"
                    className="input"
                    type="password"
                    placeholder="Input Password"
                />
                <Button loading={loading} canClick={isValid} actionText="Save Profile" />
            </form>
        </div>
    );
};
