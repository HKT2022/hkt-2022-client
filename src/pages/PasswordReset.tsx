import { useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RequiredTextField from '../components/atoms/RequiredTextField';
import { Title1Div, TextInput1, Button1, InnerFlexForm1 } from '../components/atoms/styled';
import CenterAlignedPage from '../components/templates/CenterAlignedPage';
import useToast from '../contexts/ToastContext';
import { issueEmailToken, resetPassword, verifyEmail } from '../gql/mutations';



function PasswordReset(): JSX.Element {
    const apolloClient = useApolloClient();
    const navigate = useNavigate();
    const toast = useToast();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const emailCheckId = searchParams.get('emailCheckId');
    const verifyId = searchParams.get('verifyId');

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState<string|null>(null);

    const handleNewPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    }, [setNewPassword]);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(newPassword.length < 8) {
            setNewPasswordError('Password must be at least 8 characters long');
            return;
        }

        try {
            await verifyEmail(apolloClient, { verifyId: verifyId ?? '' });
            const emailToken = (await issueEmailToken(apolloClient, { emailCheckId: emailCheckId ?? '' })).data!.issueEmailToken;
            await resetPassword(apolloClient, { emailToken: emailToken, password: newPassword });
            
            toast.showToast('Password reset successfully', 'success');
            navigate('/login');
        } catch(error: any) {
            toast.showToast(error.message, 'error');
        }
    }, [newPassword]);

    return (
        <CenterAlignedPage>
            <InnerFlexForm1 onSubmit={handleSubmit}>
                <Title1Div>
                    Reset Password
                </Title1Div>
                <RequiredTextField
                    type='password'
                    placeholder='New password'
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    error={newPasswordError}
                />
                <Button1 type='submit'>Reset Password</Button1>
            </InnerFlexForm1>
        </CenterAlignedPage>
    );
}

export default PasswordReset;