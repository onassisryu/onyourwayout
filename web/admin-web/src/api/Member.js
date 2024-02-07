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

