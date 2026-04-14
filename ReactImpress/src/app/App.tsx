import { Navigate, Route, Routes } from "react-router-dom";
import { EditorPage } from "../features/editor/EditorPage";
import { HomePage } from "../features/home/HomePage";
import { PreviewPage } from "../features/preview/PreviewPage";
import { PublishedPage } from "../features/publish/PublishedPage";

export const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/editor/:presentationId" element={<EditorPage />} />
    <Route path="/preview/:presentationId" element={<PreviewPage />} />
    <Route path="/published/:shareSlug" element={<PublishedPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
