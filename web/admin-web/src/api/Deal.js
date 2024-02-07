import { SERVER,ACCESSTOKEN } from './Config';
import axios from 'axios';


// 신고된 거래 내역 보기
export function getDealsWithComplaint(){
    return axios.get(`${SERVER}/admin/manages/deal`,{
        headers:{Authorization:`${ACCESSTOKEN}`}
    });
}

// 신고 거래 상세 조회
export function getDealWithComplaintDetail(deal_id){
    return axios.get(`${SERVER}/admin/manages/deal/`+deal_id,{
        headers:{Authorization:`${ACCESSTOKEN}`}
    })
}



