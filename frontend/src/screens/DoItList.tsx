import React, { useState } from 'react';
import {Button, ScrollView, View} from 'react-native';
import styled from '@emotion/native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import DoItListHeader from '@components/DoItListpage/DoItListHeader';
import DoItListCategory from '@components/DoItListpage/DoItListCategory';
import DoItListContent from '@components/DoItListpage/DoItListContent';
import ApartSelectionModal from '@components/DoItListpage/ApartSelectionModal';
import ReportModal from '@components/DoItListpage/ReportModal';
import { GlobalContainer } from '@/GlobalStyles';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};


const DoItList = ( {navigation, route }: Props) => {

  const [selectedApartCategory, setSelectedApartCategory] = useState<string>('');
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<string>('');

  const [apartModalVisible, setApartModalVisible] = useState<boolean>(false);
  const [selectedApart, setSelectedApart] = useState('');

  const [reportModalVisible, setReportModalVisible] = useState(false);

  return (
    <GlobalContainer>
      <ScrollView overScrollMode='never'>
        <DoItListHeader navigation={navigation}></DoItListHeader>
        <DoItListCategory 
          selectedApartCategory={selectedApartCategory}
          selectedTypeCategory={selectedTypeCategory}
          setSelectedApartCategory={setSelectedApartCategory} 
          setSelectedTypeCategory={setSelectedTypeCategory} 
          setApartModalVisible={setApartModalVisible}
          selectedApart={selectedApart}
          setSelectedApart={setSelectedApart}
        />
        <DoItListContent
          route={route}
          navigation={navigation} 
          selectedApartCategory={selectedApartCategory} 
          selectedTypeCategory={selectedTypeCategory}
          setReportModalVisible={setReportModalVisible}
        />
      </ScrollView>
      <ApartSelectionModal 
        apartModalVisible={apartModalVisible} 
        setApartModalVisible={setApartModalVisible}
        setSelectedApart={setSelectedApart}
      />
      <ReportModal
        reportModalVisible={reportModalVisible}
        setReportModalVisible={setReportModalVisible}
      />
    </GlobalContainer>
  );
};

export default DoItList;