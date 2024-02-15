import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import * as Progress from 'react-native-progress';
import axiosAuth from '@/axios/axiosAuth';

interface ProgressBarComponentProps {
  dealId: string;
  acceptId: string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProgressBarComponent = ({dealId, acceptId, setModalVisible}: ProgressBarComponentProps) => {
  const [progress, setProgress] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress(prevProgress => prevProgress - 1 / 60);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (progress < 0) {
      console.log('dealId', dealId);
      console.log('acceptId', acceptId);
      axiosAuth
        .get(`deal/out-recommend/${dealId}/${acceptId}/cancel`)
        .then(resp => {
          console.log('나가요잉 매칭 실패', resp.data);
          setModalVisible(false);
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        });
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [progress, dealId, acceptId]);

  return (
    <View
      style={css`
        margin-bottom: 20px;
      `}>
      <Progress.Bar animationConfig={{duration: 30000}} progress={progress} width={230} height={20} color={'#00D282'} />
    </View>
  );
};

export default ProgressBarComponent;
