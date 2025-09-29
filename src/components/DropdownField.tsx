import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, Modal, FlatList, StyleProp, ViewStyle } from 'react-native';

type Option = { label: string; value: string };

type Props = {
  value: string | null;
  onChange: (v: string) => void;
  placeholder?: string;
  options: Option[];
  containerStyle?: StyleProp<ViewStyle>;
};

export default function DropdownField({ value, onChange, placeholder, options, containerStyle }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={({ pressed }) => [styles.wrap, containerStyle, pressed && { opacity: 0.9 }]}>
        <Text style={[styles.text, !selected && styles.placeholder]}>{selected ? selected.label : (placeholder || 'Select')}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { onChange(item.value); setOpen(false); }}
                  style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#f2f2f2' }]}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    minHeight: 58,
  },
  text: {
    flex: 1,
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    color: '#7a7a7a',
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '65%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)'
  }
});


