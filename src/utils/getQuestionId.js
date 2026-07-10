export default function getQuestionId(question) {
  return question?.questionId ?? question?.id ?? question?._id ?? null;
}
