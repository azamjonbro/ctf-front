export default function getChallengeId(session) {
  return session?.challengeId ?? session?.id ?? session?._id ?? null;
}
