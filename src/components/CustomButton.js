import {Text, StyleSheet, Pressable} from 'react-native';
import React, { createContext, useContext } from 'react';
import { ThemeContext } from '../styles/theme-context';


const CustomButton = ({onPress, text, type = 'Primary', bgColor, fgColor}) => {

  const themeFromContext = useContext(ThemeContext)

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      borderColor: '#e8e8e8',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
      marginVertical: 5,
    },
    container_Primary: {
      backgroundColor: '#3b71f3',
    },
    container_Secondary: {
      borderColor: '#3b71f3',
      borderWidth: 2,
    },
    container_Terciary: {},
    text: {
      fontWeight: 'bold',
      fontSize: themeFromContext.textVariants.body.fontSize,
    },
    text_Primary: {
      color: 'white',
    },
    text_Secondary: {
      color: 'blue',
    },
    text_Terciary: {
      color: 'grey',
    },
  });
  
  
  return (
    <Pressable
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};



export default CustomButton;
