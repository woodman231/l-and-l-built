import { type z } from "zod";
import {userBookMarkDetailsOutputValidator} from "./userBookMarkDetailsOutputValidator"

export const listOfUserBookMarksDetailsOutputValidator = userBookMarkDetailsOutputValidator.array();

export type UserBookMarksList = z.infer<typeof listOfUserBookMarksDetailsOutputValidator>;