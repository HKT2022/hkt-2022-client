import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
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
    readonly clientConfig: gapi.auth2.ClientConfig,
    readonly singInOptions?: gapi.auth2.SigninOptions | gapi.auth2.SigninOptionsBuilder,
    readonly classNames?: string,
    readonly preLogin?: () => void,
    readonly responseHandler: (response: gapi.auth2.GoogleUser) => void
    readonly failureHandler?: (error: string) => void,
    readonly children?: React.ReactNode,
    readonly renderOptions?: {
        readonly width?: number,
        readonly height?: number,
        readonly longtitle?: boolean,
        readonly theme?: string, // must be either dark or light
    }
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
//                     failureHandler && failureHandler(reason.error);
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

function GoogleLoginButton(props: IGoogleLoginButtonProps): JSX.Element {
    const {classNames, children} = props;

    const [disabled, setDisabled] = useState(false);
    
    useEffect(() => {
        // Loading google plateform api, if it's not loaded
        if (typeof gapi === 'undefined') {
            setDisabled(true);
            getScript('https://apis.google.com/js/platform.js', () => {
                gapi.load('auth2', () => {
                    gapi.auth2.init(props.clientConfig);
                    if (!classNames && !children) {
                        gapi.signin2.render('ts-google-react-login', {...props.renderOptions});
                    }
                });
            });
        } else if (!classNames && !children) {
            gapi.signin2.render('ts-google-react-login', {...props.renderOptions});
        }
    }, []);

    const clickHandler = useCallback(() => {
        const { preLogin, responseHandler, singInOptions, failureHandler } = props;

        // if there is pre login task
        preLogin && preLogin();

        const googleAuth = gapi.auth2.getAuthInstance();
        if (googleAuth) {
            googleAuth.signIn(singInOptions)
                .then(googleUser => {
                    responseHandler(googleUser);
                })
                .catch(reason => {
                    failureHandler && failureHandler(reason.error);
                });
        }
    }, [props.preLogin, props.responseHandler, props.singInOptions, props.failureHandler]);

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
