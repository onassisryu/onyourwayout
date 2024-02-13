import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, ImageSourcePropType} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';

interface PausedMember{
    id:number,
    username:string,
    nickname:String,
    phoneNumber:String,
    aptName:String,
    dongName:String,
    hoName:String,
    pauseStart:String,
    pauseEndAt:String
}
const PausedListCardComponent=styled(ScrollView)`
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 10px;
`;

const PausedListCard=styled(GlobalContainer)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 130px;
`;

const TextComponent=styled(GlobalContainer)`
    width: 230px;
    height: initial;
    flex-direction: column;
    align-items: flex-start;
`;

const TextContent=styled(GlobalText)`
    fint-size: ${props => props.theme.fontSize.small};
    color: ${props => props.theme.color.black};
    padding: 5px 0px 5px 0px;
`;

// 정지된 사용자의 정보를 보여주는 페이지
const AdminPaused=()=>{
    const [responseData, setResponseData]=useState([]);

    useEffect(()=>{
        // 정지 사용자 데이터를 받아온다.
        axiosAuth.get('/admin/manages/pause')
        .then(resp=>{
            setResponseData(resp.data);
            console.log('성공',resp.data);
        })
        .catch(error=>{
            console.error('데이터를 가져오는 중 오류 발생: ',error);
        })
    
    },[]);

    return (
        <GlobalContainer>
            <ScrollView overScrollMode='never'>
                {responseData.map((member,index)=>(
                    // member.username : 사용자 아이디
                    // member.nickname : 사용자 닉네임
                    // member.phoneNumber: 전화번호
                    // member.aptName : 아파트 이름
                    // member.dongName: 동 이름
                    // member.hoName : 호 이름
                    <View key={index}>
                        <PausedListCard>
                            <TextComponent>
                                <TextContent>
                                    {member.username}
                                    {member.nickname}
                                    {member.phoneNumber}
                                    {member.aptName}
                                    {member.dongName}
                                    {member.hoName}
                                </TextContent>
                            </TextComponent>
                        </PausedListCard>
                    </View>
                    
                ))}
            </ScrollView>
            
        </GlobalContainer>
    )

}

export default AdminPaused;