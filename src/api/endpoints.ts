// src/api/endpoints.ts
export const API_BASE = "https://cc-project4-dummy-backend.vercel.app";

export const ENDPOINTS = {
  listLectures: `${API_BASE}/listLectures`,
  uploadTranscript: (lectureTitle: string) =>
    `${API_BASE}/uploadTranscript?lectureTitle=${encodeURIComponent(lectureTitle)}`,
  chatQA: (q: string) =>
    `${API_BASE}/qa?q=${encodeURIComponent(q)}`,
};
