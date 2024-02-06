import React, { useState } from 'react';
import { Modal, View, Text, Button, TouchableWithoutFeedback } from 'react-native';

const ReportModaltest = () => {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  
  const handleButtonClick = () => {
    setModal1Visible(true);
    setModal2Visible(true);
  };

  return (
    <View>
      <Button title="Open Modals" onPress={handleButtonClick} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal1Visible}
        onRequestClose={() => setModal1Visible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModal1Visible(false)}>
          <View>
            <Text>Modal 1</Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => setModal2Visible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModal2Visible(false)}>
          <View>
            <Text>Modal 2</Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ReportModaltest;
