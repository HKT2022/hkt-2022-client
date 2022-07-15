import { useMemo } from 'react';
import styled from 'styled-components';

const HealthBarContainerDiv = styled.div`
    width: 100%;
    height: 50px;

    border-radius: 80px;
    overflow: hidden;
    background-color: ${props => props.theme.colors.tertiary};
`;

interface HealthBarItemProps {
    healthPercentage: number;
}

const HealthBarItem = styled.div<HealthBarItemProps>`
    width: ${props => props.healthPercentage}%;
    height: 100%;
    background: ${props => props.theme.colors.primary};

    transition: width 0.5s;
`;

interface HealthBarProps {
    health: number;
    maxHealth: number;
}

function HealthBar(props: HealthBarProps) {
    const { health, maxHealth } = props;

    const healthPercentage = useMemo(() => {
        return Math.floor((health / maxHealth) * 100);
    }, [health, maxHealth]);

    return (
        <HealthBarContainerDiv>
            <HealthBarItem healthPercentage={healthPercentage} />
        </HealthBarContainerDiv>
    );
}

export default HealthBar;
