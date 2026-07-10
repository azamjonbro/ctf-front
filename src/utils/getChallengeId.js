import { useToast } from 'vue-toastification';

export default function getChallengeId(session) {
  if (!session) {
    const errorMsg = 'Topshiriq ma\'lumotlari topilmadi.';
    console.error('[getChallengeId Error] session object is null or undefined.');
    try {
      const toast = useToast();
      toast.error(errorMsg);
    } catch (e) {
      // safe fallback if called outside vue context
    }
    return null;
  }
  const id = session.challengeId || session.id || session._id;
  if (!id) {
    const errorMsg = 'Topshiriq identifikatori (ID) aniqlanmadi.';
    console.error('[getChallengeId Error] Failed to extract challengeId, id, or _id from session:', session);
    try {
      const toast = useToast();
      toast.error(errorMsg);
    } catch (e) {
      // safe fallback if called outside vue context
    }
    return null;
  }
  return id;
}
