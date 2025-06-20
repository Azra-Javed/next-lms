import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { Module } from "@/sanity.types";
import { getStudentByClerkId } from "../student/getStudentByClerkid";
import { calculateCourseProgress } from "@/lib/getProgress";

export async function getCourseProgress(clerkId: string, courseId: string) {
  // First get the student's Sanity ID
  const student = await getStudentByClerkId(clerkId);

  if (!student?._id) {
    throw new Error("Student not found");
  }

  const progressQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: progressQuery,
    params: { studentId: student._id, courseId },
  });

  const { completedLessons = [], course } = result.data;

  // Calculate overall course progress
  const courseProgress = calculateCourseProgress(
    (course?.modules as unknown as Module[]) || null,
    completedLessons
  );

  return {
    completedLessons,
    courseProgress,
  };
}
