import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as feedbackApi from '../../services/api/feedback.api'
import type { FeedbackInput } from '../../services/api/feedback.api'

export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ interviewId, payload }: { interviewId: string; payload: FeedbackInput }) =>
      feedbackApi.createFeedback(interviewId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })
}

export function useUpdateFeedbackMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      feedbackId,
      payload,
    }: {
      feedbackId: string
      payload: Partial<FeedbackInput>
    }) => feedbackApi.updateFeedback(feedbackId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })
}
