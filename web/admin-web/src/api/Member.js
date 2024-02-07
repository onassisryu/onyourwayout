const { default: axios } = require("axios")
import {SERVER, ACCESSTOKEN} from './Config.js';

// 비인증 회원 리스트 조회
export function getNonCertifiedMembers(){
    return axios.get(`${SERVER}/admin/manages/non-certified-member`,{
        headers:{
            Authorization:`${ACCESSTOKEN}`
        }
    });
}

// 비인증 회원 상세 조회
export function getNonCertifiedMemberDetail(member_id){
    return axios.get(`${SERVER}/admin/manages/non-certified-member/`+member_id,{
        headers:{
            Authorization:`${ACCESSTOKEN}`
        }
    });
}

// 비인증 회원 인증
export function authenticateMember(member_id){
    return axios.put(`${SERVER}/admin/manages/non-certified-member/`+member_id+'/certification',{
        headers:{
            Authorization:`${ACCESSTOKEN}`
        }
    })
}

// 사용자 페널티 수 추가 및 정지시간 재설정
export function givePenaltyAndSetPause(member_id){
    return axios.put(`${SERVER}/admin/manages/pause?id=`+member_id,{
        headers:{
            Authorization:`${ACCESSTOKEN}`
        }
    })
}

// 정지된 사용자 리스트 보이기
export function getPausedMember(){
    return axios.get(`${SERVER}/admin/manages/pause`,{
        headers:{
            Authorization:`${ACCESSTOKEN}`
        }
    })
}