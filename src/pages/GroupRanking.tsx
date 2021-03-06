import { useApolloClient } from '@apollo/client';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { OuterFlexDiv } from '../components/atoms/styled';
import { MEDIA_MAX_WIDTH } from '../constants/css';
import { getTodoGroup, getTodoGroupRankings, getTotalRankings } from '../gql/queries';
import { GetTotalRankings } from '../gql/__generated__/GetTotalRankings';
import useAsync from '../hooks/useAsync';
import ordinal from 'ordinal';
import useId from '../hooks/useId';
import { GetTodoGroupRankings } from '../gql/__generated__/GetTodoGroupRankings';
import SlimHealthBar from '../components/atoms/SlimHealthBar';
import { useCallback, useEffect, useState } from 'react';
import { sendHeart } from '../gql/mutations';
import useToast from '../contexts/ToastContext';
import { subscribeUserCharacterState } from '../gql/subscriptions';

const ITEMS_IN_PAGE = 10;

export const ContainerDiv = styled.div`
width: calc(max(100% - 200px, 280px));
position: relative;

@media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
    width: calc(100% - 30px);
}
`;
export const TitleContainerDiv = styled.div`   
height: 185px;
position: relative;
z-index: 2;
`;
export const TitleH2 = styled.h2`
text-align: center;
color: white;
margin-bottom: 0px;
margin-top: 0px;
padding-top: 40px;
font-size: 30px;
`;
export const TitleH1 = styled.h1`
text-align: center;
color: white;
margin-bottom: 0px;
margin-top: 0px;
padding-top: 10px;
font-size: 45px;
`;
const BodyContainerDiv = styled.div`
height: calc(100vh - 185px);
`;
const ListContainerDiv = styled.div`
width: 100%;
border-radius: 30px;
background-color: white;
box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.12);
padding: 38px;
box-sizing: border-box;
height: calc(100% - 52px);

@media (max-width: ${MEDIA_MAX_WIDTH + 60}px) {
    padding: 20px;
}
`;
const ListOl = styled.ol`
width: 100%;
list-style: none;
padding: 0px;
margin: 0px;
`;
const ListItemLi = styled.li<{ isReversedColor: boolean }>`
width: 100%;
border-radius: 21.5px;
border-style: solid;
border-width: 1px;
border-color: ${props => props.theme.colors.primary};
background-color: ${props => props.isReversedColor ? props.theme.colors.primary : 'white'};
height: 43px;
margin-bottom: 16px;
display: flex;
padding: 9px 12px;
box-sizing: border-box;
display: inline-flex;
justify-content: space-between;
color: ${props => props.isReversedColor ? 'white' : props.theme.colors.primary};

font-size: 19px;
`;
const VerticalLineDiv = styled.div<{ isReversedColor: boolean }>`
width: 1px;
height: 100%;
display: inline-block;
background-color: ${props => props.isReversedColor ? 'white' : props.theme.colors.primary};
margin-left: 14px;
margin-right: 14px;
`;
const VerticalCenterDiv = styled.div`
display: flex;
justify-content: center;
align-items: center;
`;
const RankSpan = styled.span`
min-width: 31px;
`;
const UserNameSpan = styled.span`
`;
const ScoreSpan = styled.span`
`;

export const LightBlueBallContainer = styled.div`
display: flex;
height: 0px;
position: relative;
justify-content: center;
z-index: 1;
`;
export const LightBlueBall = styled.div`
    background-color: #CEDEFF;
    width: 452px;
    height: 452px;
    border-radius: 50%;
    transform: translate(0, -280px);
`;

const BackLink = styled(Link)`
z-index: 3;
display: inline-block;
position: absolute;
left: 30px;
top: 30px;
`;
const BackIcon = styled.img`
width: 30px;
height: 30px;
cursor: pointer;
`;

function RankingList({ rankings, onHeartSendClick }: { rankings: GetTodoGroupRankings['todoGroupRankings'], onHeartSendClick: (userCharacterId: number) => void }) {
    const id = useId();

    return (
        <ListOl>
            {rankings.map((user, index) => {
                const rank = index + 1;

                const isMe = user.id === id;

                return (
                    <ListItemLi key={index} isReversedColor={isMe}>
                        <VerticalCenterDiv>
                            <RankSpan>{ordinal(rank)}</RankSpan>
                            <VerticalLineDiv isReversedColor={isMe}/>
                            <UserNameSpan>{user.username}</UserNameSpan>
                        </VerticalCenterDiv>
                        <VerticalCenterDiv>
                            { !isMe ? <div onClick={() => onHeartSendClick(user.character.id)}>???</div> : <></> }
                            <div style={{ width: '200px' }}><SlimHealthBar health={user.character.hp} maxHealth={100} isInverted={isMe} innerText={`${user.character.hp}/100`}/></div>
                            <div style={{ width: '10px' }}></div>
                            <ScoreSpan>{user.score}</ScoreSpan>
                        </VerticalCenterDiv>
                    </ListItemLi>
                );
            })}
        </ListOl>
    );
}

export default function GroupRanking() {
    const toast = useToast();

    const params = useParams();
    const groupId = Number(params.groupId) | 0;

    const apolloClient = useApolloClient();
    const groupAsync = useAsync(() => getTodoGroup(apolloClient, { id: groupId }));
    const [totalRankings, setTotalRankings] = useState<GetTodoGroupRankings['todoGroupRankings']>([]);

    useEffect(() => {
        (async () => setTotalRankings((await getTodoGroupRankings(apolloClient, { todoGroupId: groupId, skip: 0, limit: ITEMS_IN_PAGE })).data.todoGroupRankings))();
    }, [groupId]);

    useEffect(() => {
        const rankings = totalRankings;

        const observables = rankings.map(user => {
            return subscribeUserCharacterState(apolloClient, { userCharacterId: user.character.id });
        });

        const subscriptions = observables.map((observable, i) => observable.subscribe(res => {
            setTotalRankings(rankings => {
                return rankings.map(ranking => {
                    if(!res.data) return ranking;

                    if(rankings[i].id !== ranking.id) return ranking;

                    return ({
                        ...ranking,
                        character: {
                            ...ranking.character,
                            hp: res.data.userCharacterState.hp,
                        }
                    });
                });
            });
        }));

        return () => {
            subscriptions.forEach(subscription => subscription.unsubscribe());
        };
    }, [totalRankings]);

    const handleHeartSendClick = useCallback((userCharacterId: number) => {
        (async () => {
            try {
                await sendHeart(apolloClient, { userCharacterId });
                toast.showToast('Heart sent.', 'success');
            } catch(e: any) {
                toast.showToast(e.message, 'error');
            }
        })();
    }, []);

    return (
        <OuterFlexDiv>
            <BackLink to="/todo"><BackIcon src={'/static/back.svg'}/></BackLink>
            <ContainerDiv>
                <LightBlueBallContainer>
                    <LightBlueBall/>
                </LightBlueBallContainer>
                <TitleContainerDiv>
                    <TitleH2>{groupAsync.value?.data.TodoGroup.name}</TitleH2>
                    <TitleH1>Ranking</TitleH1>
                </TitleContainerDiv>
                <BodyContainerDiv>
                    <ListContainerDiv>
                        <RankingList rankings={totalRankings} onHeartSendClick={handleHeartSendClick}/>
                    </ListContainerDiv>
                </BodyContainerDiv>
            </ContainerDiv>
        </OuterFlexDiv>
    );
}