import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { colors } from '../theme/colors';

interface EditableTitleProps {
  title: string;
  isCompleted: boolean;
  onSave: (newTitle: string) => void;
}

export const EditableTitle = ({ title, isCompleted, onSave }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);
  const inputRef = useRef<TextInput>(null);

  const handleStartEditing = () => {
    setEditText(title);
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    const trimmedTitle = editText.trim();

    if (trimmedTitle.length > 0 && trimmedTitle !== title) {
      onSave(trimmedTitle);
    }

    setEditText(title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        style={[styles.titleInput, isCompleted && styles.titleCompleted]}
        value={editText}
        onChangeText={setEditText}
        onSubmitEditing={handleFinishEditing}
        onBlur={handleFinishEditing}
        autoFocus
        returnKeyType="done"
        selectTextOnFocus
      />
    );
  }

  return (
    <Pressable style={styles.textArea} onPress={handleStartEditing}>
      <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  textArea: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    minHeight: 44,
    padding: 0,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.disabled,
  },
});
