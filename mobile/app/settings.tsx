import { useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMobileTheme, presetMeta, type Preset } from '../lib/theme'

export default function SettingsScreen() {
  const { preset, tokens, setPreset } = useMobileTheme()

  const s = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: tokens.colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', padding: tokens.spacing.lg, gap: tokens.spacing.md },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: tokens.colors.bgCard, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', flex: 1 },
    section: { padding: tokens.spacing.lg },
    sectionLabel: { color: tokens.colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: tokens.spacing.md },
    presetCard: {
      flexDirection: 'row', alignItems: 'center', padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.bgCard, borderRadius: tokens.radii.lg,
      borderWidth: 2, borderColor: tokens.colors.border, marginBottom: tokens.spacing.sm,
    },
    presetCardActive: { borderColor: tokens.colors.primary },
    presetDot: { width: 12, height: 12, borderRadius: 6, marginRight: tokens.spacing.md },
    presetInfo: { flex: 1 },
    presetName: { color: '#fff', fontSize: 15, fontWeight: '700' },
    presetDesc: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
    checkIcon: { marginLeft: tokens.spacing.sm },
    infoCard: {
      padding: tokens.spacing.lg, backgroundColor: tokens.colors.bgCard,
      borderRadius: tokens.radii.lg, marginHorizontal: tokens.spacing.lg, marginTop: tokens.spacing.lg,
    },
    infoTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: tokens.spacing.xs },
    infoText: { color: tokens.colors.textMuted, fontSize: 12, lineHeight: 18 },
  }), [tokens])

  const presets = (Object.keys(presetMeta) as Preset[])

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={tokens.colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Academic Theme</Text>
      </View>

      <ScrollView>
        <View style={s.section}>
          <Text style={s.sectionLabel}>Choose a Design Preset</Text>
          {presets.map((key) => {
            const meta = presetMeta[key]
            const isActive = preset === key
            return (
              <TouchableOpacity
                key={key}
                style={[s.presetCard, isActive && s.presetCardActive]}
                onPress={() => setPreset(key)}
                activeOpacity={0.7}
              >
                <View style={[s.presetDot, { backgroundColor: meta.color }]} />
                <View style={s.presetInfo}>
                  <Text style={s.presetName}>{meta.label}</Text>
                  <Text style={s.presetDesc}>{meta.desc}</Text>
                </View>
                {isActive && (
                  <Ionicons name="checkmark-circle" size={22} color={tokens.colors.primary} style={s.checkIcon} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={s.infoCard}>
          <Text style={s.infoTitle}>About Theme Presets</Text>
          <Text style={s.infoText}>
            Each preset applies a unique design language inspired by leading educational platforms. Colors, typography, spacing, and component styles change instantly across the entire app. Your choice is saved and persists between sessions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
