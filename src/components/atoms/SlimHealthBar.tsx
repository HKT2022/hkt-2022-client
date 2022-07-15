import { useMemo } from 'react';
import styled from 'styled-components';

const HealthBarContainerDiv = styled.div<{ isInverted: boolean }>`
    width: 100%;
    height: 25px;

    border-radius: 80px;
    overflow: hidden;
    background-color: ${props => props.isInverted ? 'white' : props.theme.colors.tertiary};
    color: ${props => props.theme.colors.textLightest};

    position: relative;
    
    display: flex;
    justify-content: center;
    align-items: center;
`;

const HealthBarInnerDiv = styled.div`
    width: 100%;
    height: 100%;
`;

interface HealthBarItemProps {
    healthPercentage: number;
    isInverted: boolean;
}

const HealthBarItem = styled.div<HealthBarItemProps>`
    width: ${props => props.healthPercentage}%;
    height: 100%;
    background: ${props => props.isInverted ? props.theme.colors.tertiary : props.theme.colors.primary};

    transition: width 0.5s;
`;

const TextDiv = styled.div`
    position: absolute;
`;

interface HealthBarProps {
    health: number;
    maxHealth: number;
    isInverted: boolean;
    innerText?: string;
}

function SlimHealthBar(props: HealthBarProps) {
    const { health, maxHealth, innerText } = props;

    const healthPercentage = useMemo(() => {
        return Math.floor((health / maxHealth) * 100);
    }, [health, maxHealth]);

    return (
        <HealthBarContainerDiv isInverted={props.isInverted}>
            <HealthBarInnerDiv>
                <HealthBarItem healthPercentage={healthPercentage} isInverted={props.isInverted} />
            </HealthBarInnerDiv>
            <TextDiv>{innerText}</TextDiv>
        </HealthBarContainerDiv>
    );
}

export default SlimHealthBar;
