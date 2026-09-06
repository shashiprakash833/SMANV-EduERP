/**
 * SMANV AI Assistant & Educational Copilot
 * Developed by SMANV Info Tech Private Limited
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/ThemeContext';
import { useAI } from '@/store/AIContext';
import { SMHeader } from '@/components/SMHeader';
import { SMBadge } from '@/components/SMBadge';
import { Layout } from '@/constants/Layout';

export default function AIAssistantScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { messages, isThinking, sendMessage, clearHistory, quickPrompts } = useAI();

  const [inputQuery, setInputQuery] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    );
    return () => {
      showSub.remove();
    };
  }, []);

  const handleSend = (text?: string) => {
    const queryToSend = text || inputQuery;
    if (!queryToSend.trim()) return;
    setInputQuery('');
    sendMessage(queryToSend);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Header with Clear Action */}
      <SMHeader
        title="SMANV AI Copilot"
        subtitle="School & College Intelligence Assistant"
        showBack
        rightAction={
          <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      {/* AI Engine Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: colors.aiContainer, borderColor: colors.aiBorder }]}>
        <LinearGradient
          colors={[colors.aiGradientStart, colors.aiGradientMid]}
          style={styles.aiDot}
        >
          <Ionicons name="sparkles" size={12} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.statusText, { color: colors.primaryDark }]}>
          SMANV ERP Engine Active
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        {/* Messages Feed */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleRow,
                  isAI ? styles.aiMessageRow : styles.userMessageRow,
                ]}
              >
                {isAI && (
                  <View style={[styles.aiAvatarCircle, { backgroundColor: colors.primary }]}>
                    <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isAI
                      ? [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.cardBorder }]
                      : [styles.userBubble, { backgroundColor: colors.primary }],
                    Layout.shadows.sm,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      { color: isAI ? colors.textPrimary : '#FFFFFF' },
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Optional Embedded Action Buttons */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <View style={styles.actionButtonsRow}>
                      {msg.actionButtons.map((btn, idx) => (
                        <TouchableOpacity
                          key={`btn-${idx}`}
                          onPress={() => router.push(btn.route as any)}
                          style={[styles.msgActionBtn, { backgroundColor: colors.primaryContainer }]}
                        >
                          <Text style={[styles.msgActionText, { color: colors.primaryDark }]}>
                            {btn.label} →
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Optional Suggested Follow-Up Prompts */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <View style={styles.suggestedRow}>
                      <Text style={[styles.suggestedHeader, { color: colors.textTertiary }]}>
                        Suggested Inquiries:
                      </Text>
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <TouchableOpacity
                          key={`sugg-${idx}`}
                          onPress={() => handleSend(prompt)}
                          style={[styles.suggestedChip, { backgroundColor: colors.surfaceVariant }]}
                        >
                          <Text style={[styles.suggestedChipText, { color: colors.primary }]}>
                            • {prompt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text
                    style={[
                      styles.timestampText,
                      { color: isAI ? colors.textTertiary : 'rgba(255,255,255,0.7)' },
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* AI Inference Thinking Spinner */}
          {isThinking && (
            <View style={[styles.messageBubbleRow, styles.aiMessageRow]}>
              <View style={[styles.aiAvatarCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.thinkingBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.thinkingText, { color: colors.textSecondary }]}>
                  Analyzing campus database...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts Chips Carousel */}
        <View style={[styles.quickChipsBar, { backgroundColor: colors.surface }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsScroll}>
            {quickPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                onPress={() => handleSend(prompt)}
                style={[
                  styles.quickPromptChip,
                  { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                ]}
              >
                <Ionicons name="flash-outline" size={12} color={colors.primary} />
                <Text style={[styles.quickPromptText, { color: colors.textPrimary }]}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Query Input Bar */}
        <View style={[styles.inputBarContainer, { backgroundColor: colors.background, borderTopColor: colors.borderLight }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder="Ask SMANV AI (attendance, circulars, fees)..."
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />

            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!inputQuery.trim() || isThinking}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputQuery.trim() ? colors.primary : colors.surfaceVariant,
                },
              ]}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={inputQuery.trim() ? '#FFFFFF' : colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clearBtn: {
    padding: 6,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  aiDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    gap: 12,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  aiAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: Layout.borderRadius.lg,
    padding: 12,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  msgActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
  },
  msgActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  suggestedRow: {
    marginTop: 10,
    gap: 4,
  },
  suggestedHeader: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  suggestedChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.sm,
    marginVertical: 2,
  },
  suggestedChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timestampText: {
    fontSize: 9,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  thinkingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
  },
  thinkingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  quickChipsBar: {
    paddingVertical: 6,
  },
  quickChipsScroll: {
    paddingHorizontal: Layout.spacing.md,
    gap: 6,
  },
  quickPromptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
  },
  quickPromptText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputBarContainer: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Layout.spacing.sm : Layout.spacing.md,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    minHeight: 46,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 8,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
