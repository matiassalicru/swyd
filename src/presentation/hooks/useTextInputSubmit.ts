import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

interface UseTextInputSubmitOptions {
  onSubmit: (trimmedText: string) => void;
}

export const useTextInputSubmit = ({ onSubmit }: UseTextInputSubmitOptions) => {
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');

  const isInputEmpty = inputText.trim().length === 0;

  const handleSubmit = () => {
    const trimmedText = inputText.trim();

    if (trimmedText.length === 0) {
      return;
    }

    onSubmit(trimmedText);
    setInputText('');
    inputRef.current?.focus();
  };

  return { inputText, setInputText, inputRef, handleSubmit, isInputEmpty };
};
