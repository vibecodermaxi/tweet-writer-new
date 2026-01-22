import { create } from 'zustand';
import { Draft, QualityCritique } from '@/lib/data/types';

interface DraftState {
  // Current draft being edited
  currentDraft: Draft | null;
  currentContent: string;
  isDirty: boolean;

  // Version history
  versions: Draft[];
  selectedVersion: number;

  // Loading states
  isGenerating: boolean;
  isCritiquing: boolean;
  isIterating: boolean;
  isSaving: boolean;

  // Actions
  setCurrentDraft: (draft: Draft | null) => void;
  setContent: (content: string) => void;
  setVersions: (versions: Draft[]) => void;
  selectVersion: (version: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsCritiquing: (isCritiquing: boolean) => void;
  setIsIterating: (isIterating: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  markClean: () => void;
  reset: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  currentDraft: null,
  currentContent: '',
  isDirty: false,
  versions: [],
  selectedVersion: 1,
  isGenerating: false,
  isCritiquing: false,
  isIterating: false,
  isSaving: false,

  setCurrentDraft: (draft) =>
    set({
      currentDraft: draft,
      currentContent: draft?.content || '',
      isDirty: false,
      selectedVersion: draft?.version || 1,
    }),

  setContent: (content) =>
    set((state) => ({
      currentContent: content,
      isDirty: content !== state.currentDraft?.content,
    })),

  setVersions: (versions) => set({ versions }),

  selectVersion: (version) =>
    set((state) => {
      const draft = state.versions.find((v) => v.version === version);
      if (draft) {
        return {
          currentDraft: draft,
          currentContent: draft.content,
          selectedVersion: version,
          isDirty: false,
        };
      }
      return { selectedVersion: version };
    }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsCritiquing: (isCritiquing) => set({ isCritiquing }),
  setIsIterating: (isIterating) => set({ isIterating }),
  setIsSaving: (isSaving) => set({ isSaving }),

  markClean: () => set({ isDirty: false }),

  reset: () =>
    set({
      currentDraft: null,
      currentContent: '',
      isDirty: false,
      versions: [],
      selectedVersion: 1,
      isGenerating: false,
      isCritiquing: false,
      isIterating: false,
      isSaving: false,
    }),
}));
