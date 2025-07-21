import * as yup from "yup";

export const blogSchema = yup.object({
  title: yup.string().required(),
  content: yup.string().required(),
  isPublic: yup.boolean().required(),
});
