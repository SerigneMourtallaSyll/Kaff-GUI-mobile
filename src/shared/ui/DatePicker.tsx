/**
 * DatePicker Component
 *
 * A reusable date picker component.
 * Note: Uses TextInput for Expo Go compatibility.
 * For native date picker, use expo-dev-client or build a custom dev client.
 */
import { useState } from 'react';

import { Text, TextInput, View } from 'react-native';

import { Calendar } from 'lucide-react-native';

import { FONT_FAMILY } from '@/core/theme';

interface DatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'JJ/MM/AAAA',
  label,
  required = false,
  error,
}: DatePickerProps) {
  // Format date for display (DD/MM/YYYY)
  const formatDisplayDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert display format (DD/MM/YYYY) to ISO (YYYY-MM-DD)
  const parseDisplayDate = (displayDate: string): string => {
    const parts = displayDate.split('/');
    if (parts.length !== 3) return '';

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    // Validate
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (dayNum < 1 || dayNum > 31) return '';
    if (monthNum < 1 || monthNum > 12) return '';
    if (yearNum < 1900 || yearNum > 2100) return '';

    return `${year}-${month}-${day}`;
  };

  const [displayValue, setDisplayValue] = useState(value ? formatDisplayDate(value) : '');

  const handleChangeText = (text: string) => {
    // Remove non-numeric characters except /
    let cleaned = text.replace(/[^\d/]/g, '');

    // Auto-add slashes
    if (cleaned.length >= 2 && !cleaned.includes('/')) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 5 && cleaned.split('/').length === 2) {
      const parts = cleaned.split('/');
      cleaned = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
    }

    // Limit length
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }

    setDisplayValue(cleaned);

    // If complete date, convert to ISO and call onChange
    if (cleaned.length === 10) {
      const isoDate = parseDisplayDate(cleaned);
      if (isoDate) {
        onChange(isoDate);
      }
    }
  };

  const handleBlur = () => {
    // Validate and format on blur
    if (displayValue.length === 10) {
      const isoDate = parseDisplayDate(displayValue);
      if (isoDate) {
        onChange(isoDate);
        setDisplayValue(formatDisplayDate(isoDate));
      }
    }
  };

  return (
    <View>
      {label ? (
        <Text style={{ fontFamily: FONT_FAMILY.medium }} className="mb-2 text-sm text-foreground">
          {label} {required ? <Text className="text-danger">*</Text> : null}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center rounded-lg border ${
          error ? 'border-danger' : 'border-border'
        } bg-input px-3`}
      >
        <Calendar color={error ? '#EF4444' : '#717182'} size={20} />
        <TextInput
          value={displayValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#9C9CB1"
          keyboardType="numeric"
          maxLength={10}
          style={{ fontFamily: FONT_FAMILY.regular }}
          className="ml-2 h-12 flex-1 text-base text-foreground"
        />
      </View>

      {!error ? (
        <Text
          style={{ fontFamily: FONT_FAMILY.regular }}
          className="mt-1 text-xs text-muted-foreground"
        >
          Format: JJ/MM/AAAA (ex: 15/01/2024)
        </Text>
      ) : null}

      {error ? (
        <Text style={{ fontFamily: FONT_FAMILY.regular }} className="mt-1 text-xs text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
