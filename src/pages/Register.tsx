import {
    useApolloClient
} from '@apollo/client';
import {
    useCallback,
    useEffect,
    useState
} from 'react';
import styled from 'styled-components';

import RequiredTextField from '../components/atoms/RequiredTextField';
import {
    Button1,
    InnerFlexForm1,
    LeftAlignDiv,
    PaddingDiv,
    StyledLink,
    Title1Div
} from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useToast from '../contexts/ToastContext';
import * as Mutations from '../gql/mutations';
import useEmailValidator from '../hooks/text-validators/useEmailValidator';
import usePasswordConfirmValidator from '../hooks/text-validators/usePasswordConfirmValidator';
import usePasswordValidator from '../hooks/text-validators/usePasswordValidator';
import useRequiredValidator from '../hooks/text-validators/useRequiredValidator';

const RegisterButton = styled(Button1)`
    margin-top: 50px;
`;

const LoginLink = styled(StyledLink)`
    font-size: 15px;
`;

const MarginTopLeftAlignDiv = styled(LeftAlignDiv)`
    margin-top: 10px;
`;

const EmailFieldContainerForm = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    width: 100%;
`;

interface SendVerificationEmailButtonProps {
    isDisabled: boolean;
}

const SendVerificationEmailButton = styled(Button1)<SendVerificationEmailButtonProps>`
    height: 35px;
    margin-left: 10px;
    ${props => props.isDisabled && `
        background-color: ${props.theme.colors.buttonActive};

        &:hover {
            background-color: ${props.theme.colors.buttonActive};
        }
    `}
`;

function RegisterForm(): JSX.Element {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState<string|null>(null);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string|null>(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailVerificationId, setEmailVerificationId] = useState<string|null>(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string|null>(null);

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState<string|null>(null);

    const usernameValidator = useRequiredValidator('Username must be at least 1 characters long');
    const emailValidator = useEmailValidator();
    const passwordValidator = usePasswordValidator();
    const passwordConfirmValidator = usePasswordConfirmValidator(password);

    const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setUsernameError(usernameValidator(event.target.value));
    }, [setUsername, setUsernameError, usernameValidator]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setEmailError(emailValidator(event.target.value, emailVerified));

        if (emailVerified) {
            setEmailVerified(false);
            setEmailVerificationId(null);
        }
    }, [setEmail, setEmailError, emailValidator, emailVerified, setEmailVerified, setEmailVerificationId]);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordError(passwordValidator(event.target.value));
    }, [setPassword, setPasswordError, passwordValidator]);

    const handlePasswordConfirmChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);
        setPasswordConfirmError(passwordConfirmValidator(event.target.value));
    }, [setPasswordConfirm, setPasswordConfirmError, passwordConfirmValidator]);

    const apolloClient = useApolloClient();

    const toast = useToast();

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const usernameError = usernameValidator(username);
        const emailError = emailValidator(email, emailVerified);
        const passwordError = passwordValidator(password);
        const passwordConfirmError = passwordConfirmValidator(passwordConfirm);
        
        setUsernameError(usernameError);
        setEmailError(emailError);
        setPasswordError(passwordError);
        setPasswordConfirmError(passwordConfirmError);

        if (usernameError || emailError || passwordError || passwordConfirmError) {
            return;
        }

        Mutations.registerLocal(
            apolloClient, 
            {
                'user': {
                    'username': username,
                    'password': password,
                    'emailToken': 'some-token'
                }
            }
        ).catch(error => {
            toast.showToast(error.message, 'error');
        });
    }, [username, email, emailVerified, password, passwordConfirm, usernameValidator, emailValidator, passwordValidator, passwordConfirmValidator, apolloClient, toast]);

    const handleSendVerificationEmail = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (emailVerificationId) {
            return;
        }

        const emailError = emailValidator(email, true);

        if (emailError) {
            setEmailError(emailError);
            return;
        }

        Mutations.requestEmailCheck(
            apolloClient,
            { 'email': email }
        ).then((response) => {
            if (!response.data) throw new Error('Error while requesting email check');
            setEmailVerificationId(response.data.requestEmailCheck.id);
        }).catch(error => {
            toast.showToast(error.message, 'error');
        });
    }, [email, apolloClient, toast, emailValidator, setEmailError, setEmailVerificationId]);

    useEffect(() => {
        const emailTimer = setInterval(() => {
            if (emailVerificationId) {
                Mutations.verifyEmail(
                    apolloClient,
                    { 'verifyId': emailVerificationId }
                ).then((response) => {
                    if (!response.data) throw new Error('Error while verifying email');
                    setEmailVerified(true);
                }
                ).catch(error => {
                    toast.showToast(error.message, 'error');
                });
            }
        }, 5000);

        return () => {
            clearInterval(emailTimer);
        };
    }, [emailVerificationId, apolloClient, toast]);

    return (
        <InnerFlexForm1 onSubmit={handleSubmit}>
            <Title1Div>
                Register a new membership
            </Title1Div>
            <RequiredTextField
                placeholder='Username'
                value={username}
                onChange={handleUsernameChange}
                error={usernameError}
            />
            <EmailFieldContainerForm>
                <RequiredTextField
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                />
                <SendVerificationEmailButton onClick={handleSendVerificationEmail} isDisabled={emailVerificationId !== null}>
                    {emailVerificationId ? 'Email sent' : 'Send verification email'}
                </SendVerificationEmailButton>
            </EmailFieldContainerForm>
            <PaddingDiv height='20px'/>
            <RequiredTextField
                type='password'
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
            />
            <RequiredTextField
                type='password'
                placeholder='Confirm Password'
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                error={passwordConfirmError}
            />
            <RegisterButton type='submit'>Register</RegisterButton>
            <MarginTopLeftAlignDiv>
                <LoginLink to={'/login'}>
                    I already have a membership
                </LoginLink>
            </MarginTopLeftAlignDiv>
        </InnerFlexForm1>
    );
}

function Register(): JSX.Element {
    return (
        <CenterAlignedPage>
            <RegisterForm />
        </CenterAlignedPage>
    );
}

export default Register;
