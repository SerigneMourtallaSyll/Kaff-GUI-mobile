/**
 * CageIllustration — colour-coded SVG cage tile.
 *
 * Mirrors the prototype `CageIcon.tsx`:
 *   - libre           → green
 *   - occupee-pigeon  → red
 *   - occupee-couple  → orange
 *
 * The illustration is purely decorative; the badge with the cage number and
 * the status dot in the corners convey the state for assistive technologies.
 * The whole tile is wrapped by `Pressable` callers to make it interactive
 * (Volière screen → bottom sheet).
 */
import { Text, View } from 'react-native';

import { Users } from 'lucide-react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';

import { FONT_FAMILY } from '@/core/theme';

export type CageStatus = 'libre' | 'occupee-pigeon' | 'occupee-couple';

interface CageIllustrationProps {
  status: CageStatus;
  numero: string;
}

const colorsByStatus: Record<CageStatus, { border: string; bg: string; text: string }> = {
  libre: { border: '#4CAF50', bg: '#E8F5E9', text: '#2E7D32' },
  'occupee-pigeon': { border: '#F44336', bg: '#FFEBEE', text: '#C62828' },
  'occupee-couple': { border: '#FF9800', bg: '#FFF3E0', text: '#E65100' },
};

const verticalBars = [28, 36, 44, 52, 60, 68] as const;
const horizontalBars = [30, 40, 50, 60] as const;
const roofBars = [30, 40, 50, 60, 70] as const;

export function CageIllustration({ status, numero }: CageIllustrationProps) {
  const colors = colorsByStatus[status];

  return (
    <View className="aspect-square w-full items-center justify-center">
      <Svg viewBox="0 0 100 100" width="100%" height="100%">
        <Rect x="15" y="75" width="70" height="8" fill="#5D4037" rx={2} />
        <Rect x="12" y="70" width="76" height="5" fill="#8D6E63" rx={1} />

        <Rect
          x="20"
          y="20"
          width="60"
          height="50"
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth={2}
          rx={3}
        />

        {verticalBars.map((x) => (
          <Line
            key={`v-${x}`}
            x1={x}
            y1="22"
            x2={x}
            y2="68"
            stroke="#757575"
            strokeWidth={1.5}
            opacity={0.6}
          />
        ))}

        {horizontalBars.map((y) => (
          <Line
            key={`h-${y}`}
            x1="22"
            y1={y}
            x2="78"
            y2={y}
            stroke="#757575"
            strokeWidth={1.5}
            opacity={0.6}
          />
        ))}

        <Path d="M 20 20 Q 50 5 80 20" fill={colors.bg} stroke={colors.border} strokeWidth={2} />

        {roofBars.map((x) => (
          <Line
            key={`roof-${x}`}
            x1={x}
            y1={20 - Math.abs(50 - x) * 0.3}
            x2={x}
            y2="20"
            stroke="#757575"
            strokeWidth={1.5}
            opacity={0.6}
          />
        ))}

        <Rect
          x="42"
          y="50"
          width="16"
          height="18"
          fill="none"
          stroke={colors.border}
          strokeWidth={1.5}
          rx={2}
        />

        <Line
          x1="25"
          y1="45"
          x2="75"
          y2="45"
          stroke="#8D6E63"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>

      {/* Pigeon / couple indicator */}
      {status === 'occupee-pigeon' && (
        <View className="absolute" style={{ top: '38%' }}>
          <CagePigeonGlyph color={colors.text} />
        </View>
      )}
      {status === 'occupee-couple' && (
        <View className="absolute" style={{ top: '38%' }}>
          <Users color={colors.text} size={20} />
        </View>
      )}

      {/* Cage number badge */}
      <View className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5">
        <Text
          style={{ color: colors.border, fontFamily: FONT_FAMILY.bold }}
          className="text-[10px]"
        >
          {numero}
        </Text>
      </View>

      {/* Status dot */}
      <View className="absolute right-1 top-1">
        <View style={{ backgroundColor: colors.border }} className="h-2 w-2 rounded-full" />
      </View>
    </View>
  );
}

/** A tiny pigeon glyph (`Bird` lucide icon would be too literal at this size). */
function CagePigeonGlyph({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 7c1.5 0 3 1 3 3v1c2 0 3 1 3 3l-3 1-2 3h-3l-2 3H6l-2-3-2-1 2-2 1-2c0-3 3-6 6-6h5z"
        fill={color}
        opacity={0.85}
      />
    </Svg>
  );
}
