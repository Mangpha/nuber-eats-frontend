import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useMe } from "../../hooks/useMe";
import { verifyEmail, verifyEmailVariables } from "../../__api__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
        verifyEmail(input: $input) {
            ok
            error
        }
    }
`;

export const ConfirmEmail = () => {
    const client = useApolloClient();
    const { data: userData } = useMe();
    const onCompleted = (data: verifyEmail) => {
        const { ok } = data.verifyEmail;
        if (ok && userData?.me.id) {
            client.writeFragment({
                id: `User:${userData.me.id}`,
                fragment: gql`
                    fragment VerifiedUser on User {
                        verified
                    }
                `,
                data: {
                    verified: true,
                },
            });
        }
    };
    const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, {
        onCompleted,
    });

    useEffect(() => {
        const [_, code] = window.location.href.split("code=");

        verifyEmail({
            variables: {
                input: {
                    code,
                },
            },
        });
    }, [verifyEmail]);

    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <h2 className="text-lg mb-1 font-medium tracking-wide">Confirming email...</h2>
            <h4 className="text-gray-700 text-sm">Please wait, don't close this page...</h4>
        </div>
    );
};
