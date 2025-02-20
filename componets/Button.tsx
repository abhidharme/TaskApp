import React from "react";
import { Button } from "react-native-paper";

interface ButtonProps {
  title: string;
  onPress: () => void;
  contentStyle?: object;  // Accept custom styles for button container
  labelStyle?: object;    // Accept custom styles for button text
  disabled?: boolean;    // Accept custom styles for button text
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress, contentStyle, labelStyle, disabled }) => {
  return (
    <Button 
      mode="contained" 
      onPress={onPress} 
      contentStyle={[{ marginVertical: 10 }, contentStyle]}
      labelStyle={labelStyle}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default AppButton;
