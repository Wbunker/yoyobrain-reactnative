import {Text, StyleSheet, Pressable} from 'react-native';
import React, { createContext, useContext } from 'react';
import { ThemeContext } from '../styles/theme-context';


const CustomButton = ({onPress, text, type = 'Primary', bgColor, fgColor}) => {

  const themeFromContext = useContext(ThemeContext)

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      borderColor:  themeFromContext.colors.grey,
      padding: themeFromContext.spacing.m,
      alignItems: 'center',
      borderRadius: themeFromContext.spacing.s,
      marginVertical: themeFromContext.spacing.xs,
    },
    container_Primary: {
      backgroundColor: themeFromContext.colors.primary,
    },
    container_Secondary: {
      backgroundColor: themeFromContext.colors.secondary,
      borderColor: themeFromContext.colors.primary,
      borderWidth: themeFromContext.spacing.xxs,
    },
    container_Terciary: {},
    text: {
      fontWeight: 'bold',
      fontSize: themeFromContext.textVariants.body.fontSize,
    },
    text_Primary: {
      color: themeFromContext.colors.background,
    },
    text_Secondary: {
      color: themeFromContext.colors.secondary,
    },
    text_Terciary: {
      color: themeFromContext.colors.foreground,
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
