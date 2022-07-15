import { CredentialResponse } from 'google-one-tap';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GOOGLE_CLIENT_ID } from '../../constants/googleClient';
import getScript from '../../utilities/getScript';
import { Button1 } from './styled';

const SigninWithGoogleButton = styled(Button1)`
    background-color: ${props => props.theme.colors.primary};

    &:hover {
        background-color: ${props => props.theme.colors.background};
    }

    &:active {
        background-color: ${props => props.theme.colors.tertiary};
    }

    margin-bottom: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 0px 40px;

    color: ${props => props.theme.colors.textLightest};

    position: relative;
`;

export interface IGoogleLoginButtonProps {
    readonly responseHandler: (response: CredentialResponse) => void,
    readonly children?: React.ReactNode
}

// class GoogleLoginButton extends Component<IGoogleLoginButtonProps> {
//     public constructor(props: IGoogleLoginButtonProps) {
//         super(props);
//     }
//     public componentDidMount(): void {
//         const {classNames, children} = this.props;
//         // Loading google plateform api, if it's not loaded
//         if (typeof gapi === 'undefined') {
//             this.setState({ disabled: true });
//             getScript('https://apis.google.com/js/platform.js', () => {
//                 gapi.load('auth2', () => {
//                     gapi.auth2.init(this.props.clientConfig);
//                     if (!classNames && !children) {
//                         gapi.signin2.render('ts-google-react-login', {...this.props.renderOptions});
//                     }
//                 });
//             });
//         } else if (!classNames && !children) {
//             gapi.signin2.render('ts-google-react-login', {...this.props.renderOptions});
//         }
//     }

//     public readonly clickHandler = () => {
//         const { preLogin, responseHandler, singInOptions, failureHandler } = this.props;

//         // if there is pre login task
//         preLogin && preLogin();

//         const googleAuth = gapi.auth2.getAuthInstance();
//         if (googleAuth) {
//             googleAuth.signIn(singInOptions)
//                 .then(googleUser => {
//                     responseHandler(googleUser);
//                 })
//                 .catch(reason => {
//                     failureHandler?.(reason.error);
//                 });
//         }
//     };

//     public render(): JSX.Element {
//         const { children } = this.props;

//         return (
//             <SigninWithGoogleButton
//                 id='ts-google-react-login'
//                 onClick={this.clickHandler}
//             >
//                 {children ? children : null}
//             </SigninWithGoogleButton>
//         );
//     }
// }

// const handleCredentialResponse = (response: CredentialResponse) => {
//     console.log(response);
// };

function GoogleLoginButton(props: IGoogleLoginButtonProps): JSX.Element {
    const {children} = props;

    const [disabled, setDisabled] = useState(false);

    const handleCredentialResponse = useCallback((response: CredentialResponse) => {
        props.responseHandler(response);
    }, [props.responseHandler]);
    
    useEffect(() => {
        // Loading google plateform api, if it's not loaded
        if (typeof google === 'undefined') {
            setDisabled(true);
            getScript('https://accounts.google.com/gsi/client', () => {
                google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                google.accounts.id.prompt();
              
            });
        }
    }, [setDisabled]);

    const clickHandler = useCallback(() => {
        if (!disabled) {
            google.accounts.id.prompt();
        }
    }, [disabled]);

    return (
        <SigninWithGoogleButton
            id='ts-google-react-login'
            onClick={clickHandler}
            disabled={disabled}
        >
            {children ? children : null}
        </SigninWithGoogleButton>
    );
}

export default GoogleLoginButton;
